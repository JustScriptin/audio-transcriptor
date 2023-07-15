#!/bin/bash

# Define our directory and output file
src_dir=$(pwd)
combined_file="${src_dir}/combined_$(date +%Y%m%d_%H%M%S).txt"

# Define our exclusion lists
excluded_dirs=("node_modules" ".next")
excluded_files=(".env" ".git" "package-lock.json")

# Define allowed extensions
allowed_extensions=("txt" "c" "h" "html" "js" "json" "ts" "xml" "yml" "css" "md" "tsx")

# Clear our output file
echo -n "" > "$combined_file"

# Build the 'find' command
find_command="find \"$src_dir\" -type f"
for dir in "${excluded_dirs[@]}"; do
  find_command+=" ! -path \"*/$dir/*\""
done
for file in "${excluded_files[@]}"; do
  find_command+=" ! -name \"$file\""
done
find_command+=" -print0"

# Search recursively in our directory for files
while IFS= read -r -d '' file
do
  # Check file extension and include only allowed ones
  filename=$(basename "$file")
  extension="${filename##*.}"
  
  process_file=false
  if [ "$filename" == "Dockerfile" ]; then
    process_file=true
  else
    for allowed_ext in "${allowed_extensions[@]}"
    do
      if [[ "$extension" == "$allowed_ext" ]]; then
        process_file=true
        break
      fi
    done
  fi

  if $process_file ; then
    # Append the filename to the big file
    echo -e "\n\n\n${file#./}:\n" >> "$combined_file"
    # Append the file contents to the big file
    cat "$file" >> "$combined_file"
  fi
done < <(eval "$find_command")

# Output a completed message
echo "Done. Output in: $combined_file"