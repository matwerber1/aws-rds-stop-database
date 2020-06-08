# aws-rds-stop-database

Simple Lambda function that runs on a schedule to keep an RDS database stopped.

## Design

A CloudWatch Event invokes a Lambda every six hours. The Lambda function issues a stop command to the database named in the CloudFormation template's parameters.

## Other thoughts

I chose the "rate-based" schedule for simplicity. Sure, it leads to unecessary Lambda invocations but the cost during the month would be essentially 0.00 given that the AWS free tier would allow for ~1M invocations. 

Of course, an "event-driven" approach would perhaps be more technically sound in the sense that it would occur at exactly the right time. It wouldn't be difficult to hook into CloudWatch Events for RDS and use those to invoke our Lambda, instead.

The reason I chose rate-based over event-driven is that I didn't to go through the trouble (for now) of trying to determine all the possible states / event-paths and making sure they're properly handled in my code. 

For example - imagine an RDS database is started. That would trigger a CloudWatch Event and hit my Lambda... but if the Lambda tries to issue a stop command immediately, an error will occur since you can't stop an RDS database in a "starting up" state... you must wait until its available. So you'd have to implement some sort of delay, or maybe even retry logic. Both of these can be solved by step functions, but it another component to add to the mix that I didn't want to do right now.

Another issue is that when you issue a start command, several other status changes might take place, such as "Enabling enhanced monitoring" or potentially the database even entering maintenance mode to apply a patch for a window that had passed while it was stopped. You'd want to implement some sort of retry logic, and logic that could retry over the course of at least 5 minutes (maybe 20 to be safe). Againi, waits and retries lends itself to Step Functions, but that's not something I wanted right now.
