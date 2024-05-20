# MMPs Backend - Requirements Document

## 1. Introduction

The backend of the MMPs (Multi-Modal Proctoring System) project serves as the core component responsible for handling authentication, quiz management, and user data processing. This document outlines the functional and non-functional requirements specific to the backend.

## 2. Functional Requirements

### 2.1 Authentication

1. **User Registration**: Implement a registration endpoint to allow users to create accounts with MMPs by providing necessary information such as username, email, and password.

2. **User Authentication**: Develop authentication mechanisms to securely authenticate users using their credentials (username/email and password).

3. **Biometric Authentication**: Integrate biometric authentication functionality to authenticate users using biometric modalities such as fingerprints, iris scans, or facial recognition.

### 2.2 Quiz Management

1. **Quiz Creation**: Implement endpoints to allow admin users to create quizzes by specifying the quiz title, description, and questions.

2. **Quiz Taking**: Develop endpoints to allow registered users to take quizzes online, answering multiple-choice or open-ended questions.

3. **Scoring**: Implement functionality to automatically score quizzes upon completion and provide instant feedback to users.

### 2.3 User Management

1. **Profile Management**: Develop endpoints to allow users to view and update their profile information, including username, email, and password.

2. **User Role Management**: Implement functionality to assign different roles (admin, regular user) to users and manage their access permissions.

## 3. Non-functional Requirements

### 3.1 Security

1. **Data Encryption**: Ensure that sensitive user data, including passwords and biometric templates, is encrypted to maintain confidentiality.

2. **Access Control**: Implement access control mechanisms to restrict access to sensitive functionalities and resources based on user roles.

### 3.2 Performance

1. **Response Time**: Ensure that backend APIs respond to requests within 2 seconds to provide a seamless user experience.

2. **Scalability**: Design the backend system to handle a large number of concurrent users without significant degradation in performance.

### 3.3 Reliability

1. **Error Handling**: Implement robust error handling mechanisms to gracefully handle errors and exceptions, providing informative error messages to users.

2. **Logging**: Ensure that system events, errors, and user activities are logged for monitoring and troubleshooting purposes.

## 4. Constraints

1. **Technology Stack**: The backend must be implemented using TypeScript with the Express.js framework for handling HTTP requests and business logic.

2. **Database**: Utilize a non-relational database (e.g., MongoDB) for storing user data, quiz information, and authentication tokens.

3. **Compliance**: Ensure that the backend system complies with relevant data protection regulations, such as GDPR, in handling user data.
