import os
import shutil

def auto_update_supabase_functions_global_types():
    # Define the paths
    script_dir = os.path.dirname(os.path.realpath(__file__))
    source_dir = os.path.join(script_dir, '../types')
    target_dir = os.path.join(script_dir, '../supabase/functions/_types/global')
    
    # Ensure the target directory exists
    os.makedirs(target_dir, exist_ok=True)

    # Delete all .ts files in the target directory
    for file in os.listdir(target_dir):
        if file.endswith('.ts'):
            os.remove(os.path.join(target_dir, file))
    
    # Copy all .ts files from the source directory to the target directory
    for file in os.listdir(source_dir):
        if file.endswith('.ts'):
            source_file_path = os.path.join(source_dir, file)
            target_file_path = os.path.join(target_dir, file)
            
            # Copy the file
            shutil.copy2(source_file_path, target_file_path)
            
            # Modify the imports in the copied file
            modify_imports(target_file_path)

def modify_imports(file_path):
    # Read the content of the file
    with open(file_path, 'r') as file:
        content = file.readlines()

    comment = "/**\n * Auto generated types. DO NOT MODIFY THIS FILE\n * To update this interface, modify the equivalent file in the types folder in the root of the project\n * then run `python .husky/auto_update_supabase_functions_global_types.py`\n * or commit your changes and the file will be updated automatically\n */\n\n"
    content.insert(0, comment)
    
    # Modify the import statements
    new_content = []
    for line in content:
        if 'import' in line and 'from' in line and not '.ts";' in line:
            # Identify the starting index of the import path
            start_quote_index = line.rfind('"') if '"' in line else line.rfind("'")
            if start_quote_index != -1:
                # Insert '.ts' before the last quote character
                line = line[:start_quote_index] + '.ts' + line[start_quote_index:]
            new_content.append(line)
        else:
            new_content.append(line)
    
    # Write the modified content back to the file
    with open(file_path, 'w') as file:
        file.writelines(new_content)

if __name__ == '__main__':
    auto_update_supabase_functions_global_types()
