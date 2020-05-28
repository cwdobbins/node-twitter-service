#!/bin/bash
echo "Setting environment variables for app..."

while IFS= read -r line; do
    [[ $line =~ ^#.* ]] && continue
    IFS='='; read -a fields <<< "$line"
    echo "Setting ${fields[0]} = ${fields[1]}"
    eval "export ${fields[0]}='${fields[1]}'"
done < ".env"
echo "Finished."
