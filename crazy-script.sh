#!/bin/bash

repo_link="https://github.com/bekhzodalt/Next-GQL-HeadlessWordPress-Faustjs"
user_name="bekhzodalt"
user_email="edu.bekhzod@gmail.com"
history_start_date="2025-01-01"
history_end_date="2025-03-01"
file_name="text-$(cat /dev/urandom | tr -cd 'a-zA-Z0-9' | head -c 20).txt"

folder_name=$(echo "$repo_link" | sed 's/.*\/\([^\/]*\)\.git/\1/')

git clone "$repo_link"
cd "$folder_name"
git config user.name "$user_name"
git config user.email "$user_email"

commit_count=0
is_first_push=true

# Function to replace a .txt file with random text
replace_with_random_text() {
    local random_text
    random_text=$(cat /dev/urandom | tr -cd 'a-zA-Z0-9' | head -c 20)
    echo "$random_text" > "$file_name"
    echo "File content replaced with random text: $random_text"
}

# Function to perform random commits during a day
random_commit_in_day() {
    local current_date="$1"
    local max_commit="$2"
    rand_count=$(( ( RANDOM % max_commit ) + 1 ))

    for (( i = 0; i < rand_count; i++ )); do
        rand_hour=$(( ( RANDOM % 13 ) + 9 ))
        rand_minute=$(( RANDOM % 60 ))
        rand_second=$(( RANDOM % 60 ))

        replace_with_random_text
        git add .

        GIT_AUTHOR_DATE="$current_date $rand_hour:$rand_minute:$rand_second"         GIT_COMMITTER_DATE="$current_date $rand_hour:$rand_minute:$rand_second"         git commit -m "crazy coding - $current_date $rand_hour:$rand_minute:$rand_second"
        (( commit_count++ ))
    done
}

# Function to commit changes between two dates, skipping weekends
echo_dates_range_skip_weekends() {
    local start_date="$1"
    local end_date="$2"
    local max_commit=4
    local weekend_max_commit=4

    start_ts=$(date -d "$start_date" +%s)
    end_ts=$(date -d "$end_date" +%s)

    if [[ "$start_ts" -gt "$end_ts" ]]; then
        echo "Error: Start date is after end date!"
        return 1
    fi

    current_ts="$start_ts"
    while [[ "$current_ts" -le "$end_ts" ]]; do
        current_date=$(date -d "@$current_ts" "+%Y-%m-%d")
        day_of_week=$(date -d "$current_date" +%u)

        if [[ "$day_of_week" -eq 6 || "$day_of_week" -eq 7 ]]; then
            work_on_weekend=$(( RANDOM % 7 ))
            if [[ "$work_on_weekend" -eq 0 ]]; then
                echo "==== git commit (weekend) === $current_date"
                random_commit_in_day "$current_date" "$weekend_max_commit"
            fi
        else
            rand_num=$(( RANDOM % 5 ))
            if [[ "$rand_num" -gt 0 ]]; then
                echo "==== git commit (weekday) === $current_date"
                random_commit_in_day "$current_date" "$max_commit"
            fi
        fi

        current_ts=$((current_ts + 86400))
    done
    git pull origin master --allow-unrelated-histories
    git commit -am "Merge branch 'master'"
    git push
}

echo_dates_range_skip_weekends "$history_start_date" "$history_end_date"
