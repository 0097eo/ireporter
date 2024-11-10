# iReporter

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technical Specifications](#technical-specifications)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup and Installation](#setup-and-installation)
  - [Testing](#testing)
- [Contribution](#contribution)
- [License](#license)

---

## Overview
**iReporter** is a web platform designed to combat corruption by enabling citizens to report incidents and request government interventions on critical issues. This application empowers users to raise awareness and notify authorities about incidents related to corruption (red-flag records) and other matters requiring government intervention, such as infrastructure issues, through a transparent and accessible system.

## Features

1. **User Authentication**:
   - Users can create an account and log in to access platform features.

2. **Red-Flag Records**:
   - Users can create, edit, and delete records of incidents linked to corruption.

3. **Intervention Records**:
   - Users can create, edit, and delete intervention requests for government action on issues needing attention.

4. **Geolocation**:
   - Users can add latitude and longitude coordinates to red-flag and intervention records.
   - Users can update geolocation as needed.

5. **Admin Status Management**:
   - Admins can change the status of a record to one of the following:
     - **Under Investigation**: When a report is actively being reviewed.
     - **Rejected**: In the event of a false claim.
     - **Resolved**: When an incident or intervention has been successfully addressed.

6. **Real-Time Notifications**:
   - Users receive email notifications when the admin changes the status of their record.

## Technical Specifications
- **Backend**: Flask Python
- **Database**: SQLAlchemy for data storage and management
- **Frontend**: React.js with Redux Toolkit for state management
- **Testing Frameworks**: Jest for frontend testing and MiniTests for backend testing
- **Wireframes**: Created using Figma and optimized for mobile responsiveness

## Getting Started

### Prerequisites
- **Frontend**: Node.js and npm
- **Backend**: Python 3.x, Flask, SQLAlchemy

### Setup and Installation

1. **Clone the Repository**
   ```
   git clone https://github.com/0097eo/ireporter.git
   ```
2. **Backend Setup**
   ```
   cd backend
   pip install -r requirements.txt
   flask run
   ```

3. **Frontend Setup**
   ```
   cd frontend
   npm install
   npm start
   ```
### Testing
- Frontend: Run npm test in the frontend directory.
- Backend: Run tests with python -m unittest in the backend directory.

### Contribution
Contributions are welcome! Please open an issue or submit a pull request for any feature suggestions or bug reports.

### License
This project is licensed under the MIT license
