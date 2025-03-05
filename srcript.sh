#!/bin/bash

process_directory() {
    local dir="$1"
    
    # Loop through all files and directories in the current directory
    for entry in "$dir"/*; do
        if [[ -f "$entry" ]]; then
            echo "File: $entry"
            cat "$entry"
            echo -e "\n----------------------\n"
        elif [[ -d "$entry" ]]; then
            process_directory "$entry"  # Recursive call for subdirectories
        fi
    done
}

# Start processing from the src directory
process_directory "src"

