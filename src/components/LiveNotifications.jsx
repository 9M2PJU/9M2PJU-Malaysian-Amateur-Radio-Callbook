import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { MdPersonAdd, MdEdit, MdPersonOff, MdPerson, MdClose } from 'react-icons/md';

const LiveNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [myIdentity, setMyIdentity] = useState(null);

    // Keep track of processed events to prevent duplicates if strict mode double-invokes
    const processedEvents = useRef(new Set());

    const addNotification = (input) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            ...input,
            timestamp: new Date()
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // 1. Determine Identity for Presence
    useEffect(() => {
        const fetchIdentity = async () => {
            if (!user) return;

            try {
                // Fetch the primary callsign for this user
                const { data, error } = await supabase
                    .from('callsigns')
                    .select('callsign')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: true }) // Oldest usually implies main
                    .limit(1)
                    .maybeSingle();

                if (data) {
                    setMyIdentity(data.callsign);
                } else {
                    // Fallback using email or generic name if no callsign
                    const name = user.email ? user.email.split('@')[0] : 'Member';
                    setMyIdentity(name);
                }
            } catch (err) {
                console.error('Error fetching identity:', err);
                setMyIdentity('Member');
            }
        };

        fetchIdentity();
    }, [user]);

    // 2. Setup Realtime Subscriptions
    useEffect(() => {
        // REQUIRE LOGGED IN USER to see notifications
        if (!user) return;

        // We need an identity to track presence effectively, but we can listen even without it.
        // If we are logged in, we want to broadcast our identity.

        const channel = supabase.channel('global_presence', {
            config: {
                presence: {
                    key: user?.id || 'anon-' + Math.random(),
                },
            },
        });

        // --- Presence: Track Logins / Logouts ---
        channel
            .on('presence', { event: 'sync' }, () => {
                // Initial sync - we assume these people are already online, so maybe don't notify
                // Or we could list them in a "Who's online" sidebar, but for toasts, maybe skip.
                // const state = channel.presenceState();
                // console.log('Synced presence state:', state);
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                newPresences.forEach(presence => {
                    // Don't notify about ourselves
                    if (presence.user_id === user?.id) return;
                    if (presence.presence_ref === channel.presenceState()[key]?.[0]?.presence_ref) return; // Basic debounce

                    const name = presence.callsign || 'A member';
                    addNotification({
                        type: 'login',
                        title: `${name} is online`,
                        message: 'Just logged in',
                        icon: <MdPersonAdd style={{ color: '#4ade80' }} />
                    });
                });
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                leftPresences.forEach(presence => {
                    // Don't notify about ourselves
                    if (presence.user_id === user?.id) return;

                    const name = presence.callsign || 'A member';
                    addNotification({
                        type: 'logout',
                        title: `${name} went offline`,
                        message: 'Logged out',
                        icon: <MdPersonOff style={{ color: '#9ca3af' }} />
                    });
                });
            });

        // --- Database: Track Edits ---
        // Listen to changes on 'callsigns' table
        channel
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'callsigns' },
                (payload) => {
                    handleDatabaseChange(payload);
                }
            )
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    // If we have an identity, track it in presence
                    if (myIdentity && user) {
                        await channel.track({
                            user_id: user.id,
                            callsign: myIdentity,
                            online_at: new Date().toISOString(),
                        });
                    }
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, myIdentity]); // Re-run if user or identity changes

    const handleDatabaseChange = async (payload) => {
        // Ignore our own changes to avoid noise?
        // Actually, user said "9M2PJU is logged in, 9M2ABC is editing".
        // Usually you want to see others' edits. 
        // Payload gives us the `new` or `old` record. We check `user_id` if available.
        // Note: RLS might hide `user_id` if we aren't careful, but Public selection usually allows it.

        const record = payload.new || payload.old;
        if (!record) return;

        // If it's our own change, skip
        if (user && record.user_id === user.id) return;

        let title = '';
        let message = '';
        let icon = <MdEdit style={{ color: '#60a5fa' }} />;

        try {
            if (payload.eventType === 'INSERT') {
                title = `New Operator: ${record.callsign}`;
                message = `${record.name} just joined the directory!`;
                icon = <MdPersonAdd style={{ color: '#c084fc' }} />;
            } else if (payload.eventType === 'UPDATE') {
                title = `${record.callsign} updated`;
                message = 'Profile information was just updated.';
            } else if (payload.eventType === 'DELETE') {
                title = `${record.callsign} removed`;
                message = 'Operator removed from directory.';
                icon = <MdClose style={{ color: '#f87171' }} />;
            }

            if (title) {
                addNotification({
                    type: payload.eventType.toLowerCase(),
                    title,
                    message,
                    icon
                });
            }
        } catch (e) {
            console.error('Error handling db notification:', e);
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="live-notifications-container">
            {notifications.map((note) => (
                <div
                    key={note.id}
                    className="live-notification-toast"
                >
                    <div className="notification-icon-wrapper">
                        {note.icon || <MdPerson style={{ color: '#ffffff' }} />}
                    </div>
                    <div className="notification-content">
                        <h4 className="notification-title">{note.title}</h4>
                        <p className="notification-message">{note.message}</p>
                    </div>
                    <button
                        onClick={() => removeNotification(note.id)}
                        className="notification-close-btn"
                    >
                        <MdClose size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default LiveNotifications;
