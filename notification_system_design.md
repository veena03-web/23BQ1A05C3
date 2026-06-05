# Notification System Design

## Stage 2 - Database Design

Database Used:
- PostgreSQL

Reason:
- Supports structured data
- Good query performance
- Scalable for large notification systems

Sample Schema:

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    student_id INT,
    type VARCHAR(50),
    message TEXT,
    is_read BOOLEAN,
    created_at TIMESTAMP
);
```

Possible Challenges:
- Large data growth
- Slow queries

Solutions:
- Indexing
- Pagination
- Query optimization



## Stage 3 - Query Optimization

Original Query:

```sql
SELECT * FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

Problems:
- SELECT * fetches unnecessary columns
- Missing indexes
- Full table scan possible

Optimized Query:

```sql
SELECT id, type, message, createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;
```

Suggested Index:

```sql
CREATE INDEX idx_notifications
ON notifications(studentID, isRead);
```



## Stage 4 - Database Overload

Problem:
Database is queried on every page refresh.

Solutions:
- Redis Cache
- Pagination
- Lazy Loading

Advantages:
- Faster response time
- Reduced database load

Disadvantages:
- Extra memory usage
- Cache management complexity



## Stage 5 - Mass Notification Design

Problems in Existing Design:
- Sequential execution is slow
- Email sending delays processing
- Failures interrupt execution

Improved Solution:
- Use asynchronous processing
- Use queue system
- Separate database save and email service

Revised Pseudocode:

```text
function notify_all(student_ids, message)

    for each student_id

        save_to_database()

        add_to_queue()

Worker Process:

    get_task()

    send_email()

    push_notification()

    retry_failed_tasks()
```