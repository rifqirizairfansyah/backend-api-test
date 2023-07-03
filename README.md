
# Serverless AWS Email Notification with Scheduler and Lambda

This project focuses on updating the serverless AWS application to incorporate email notifications for user registrations. It utilizes the @aws-sdk/client-scheduler library to schedule events, which are then processed by a Lambda function to send the email notifications.




## Features

- User registration triggers the email notification process.
- The @aws-sdk/client-scheduler library is used to schedule events for email notifications.
- A Lambda function processes the scheduled events and sends the email notifications.

This project aims to provide a scalable and efficient solution for sending email notifications in a serverless AWS environment. By utilizing the scheduler library and Lambda functions, email notifications can be processed asynchronously, reducing the load on the main application and ensuring timely delivery of notifications to registered users.