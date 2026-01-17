import re

input_file = '/home/x/9M2PJU-Malaysian-Amateur-Radio-Call-Book/backups/backup_20260116_201416.sql'
output_file = '/home/x/9M2PJU-Malaysian-Amateur-Radio-Call-Book/sql/restore_data.sql'

def parse_value(val):
    if val == '\\N':
        return 'NULL'
    # Escape single quotes
    val = val.replace("'", "''")
    return f"'{val}'"

try:
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    start_line = -1
    for i, line in enumerate(lines):
        if line.startswith('COPY public.callsigns'):
            start_line = i
            break
            
    if start_line == -1:
        print("Could not find COPY command")
        exit(1)
        
    # Extract columns
    copy_cmd = lines[start_line]
    match = re.search(r'\((.*?)\)', copy_cmd)
    if not match:
        print("Could not parse columns")
        exit(1)
    columns = match.group(1)
    
    inserts = []
    # Add a TRUNCATE to clear existing data before restore (optional, but safer to avoid duplicates if partial data exists)
    # user can decide to run it or not. I will uncomment it.
    inserts.append("-- WARNING: This will delete all current callsigns before restoring.")
    inserts.append("TRUNCATE TABLE public.callsigns CASCADE;") 
    
    for i in range(start_line + 1, len(lines)):
        line = lines[i].strip()
        if line == '\.':
            break
        
        parts = line.split('\t')
        values = [parse_value(p) for p in parts]
        
        # Construct INSERT statement
        # We process in batches or single? Single is safer for debugging but larger file.
        # Let's do single for simplicity of script.
        stmt = f"INSERT INTO public.callsigns ({columns}) VALUES ({', '.join(values)});"
        inserts.append(stmt)
        
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(inserts))
        
    print(f"Created {len(inserts)} instructions in {output_file}")
    
except Exception as e:
    print(f"Error: {e}")
