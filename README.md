# aws-rds-stop-database

Simple Lambda function that runs on a schedule to keep an RDS database stopped.

## Design

A CloudWatch Event invokes a Lambda every six hours. The Lambda function issues a stop command to the database named in the CloudFormation template's parameters.

## Other thoughts

I chose the "poll-based" approach for simplicity. Sure, it leads to unecessary Lambda invocations but the cost during the month would be essentially 0.00 given that the AWS free tier would allow for ~1M invocations. 

Of course, an "event-driven" approach would perhaps be more technically sound in the sense that it would occur at exactly the right time. It wouldn't be difficult to hook into CloudWatch Events for RDS and filter for status changes... just wanted to start with this simpler approach first. 
