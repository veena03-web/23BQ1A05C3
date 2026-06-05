/*

========================
Stage 3
========================

Query:

SELECT * FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;

Issues:
1. SELECT * fetches all columns unnecessarily.
2. No indexes are used.
3. Large amount of data can slow down query execution.

Optimized Query:

SELECT id, type, message, createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;

Suggested Index:

CREATE INDEX idx_notifications
ON notifications(studentID, isRead);

Indexes should not be added to every column because:
- they consume memory
- insert/update operations become slower



========================
Stage 4
========================

Problem:
Notifications are loaded from database every time the page refreshes.
This increases database load.

Solutions:
1. Use Redis cache
2. Use pagination
3. Load notifications in batches

Advantages:
- Faster response
- Reduced database load

Disadvantages:
- Redis requires extra memory
- Cache management becomes harder



========================
Stage 5
========================

Problems in current implementation:
1. Notifications are processed one by one.
2. Sending emails can take more time.
3. Failure in between affects execution.

Improved Approach:
- Use asynchronous processing
- Use message queue
- Separate email service from database save operation

Revised Pseudocode:

function notify_all(student_ids, message) {

    for each student_id {

        save_to_database(student_id, message)

        add_to_queue(student_id, message)

    }

}

Worker Process:

while queue not empty {

    task = get_task()

    try {

        send_email(task.student_id)

        push_notification(task.student_id)

    }

    catch(error) {

        retry_task(task)

    }

}

*/
     
