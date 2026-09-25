# Vietnamese Business Insights

Build a modern enterprise web application called Vietnamese Business Data Assistant.

The system has 3 main modules:

Text-to-SQL & Business Analytics

Document Q&A using RAG

System Administration

The application is designed for business users who may not know SQL. Users can ask questions in Vietnamese using natural language, query structured business databases, visualize results, and ask questions about internal business documents.

IMPORTANT:

Focus on building a polished FRONTEND/UI prototype.

Use realistic mock data.

Do not build complex backend logic unless necessary.

All interactions should work with mock data.

The UI should look like a professional enterprise SaaS product, not a generic chatbot.

Use a consistent design system across all modules.

The application should be responsive for desktop screens.

Prioritize usability and information hierarchy.

DESIGN STYLE

Use a modern enterprise analytics aesthetic inspired by products such as:

Microsoft Power BI

Databricks

Snowflake

Notion

Linear

modern AI assistants

Design principles:

Clean

Minimal

Professional

Data-oriented

High information density without looking cluttered

Rounded cards

Subtle borders and shadows

Clear typography

Consistent spacing

Professional icons

Avoid excessive gradients

Avoid overly colorful AI/chatbot aesthetics

Use a light theme as the primary theme.

Create a reusable design system for:

Buttons

Inputs

Selects

Cards

Tables

Tabs

Badges

Alerts

Modal dialogs

Side panels

Tooltips

Dropdowns

Empty states

Loading states

Error states

GLOBAL APP SHELL

Create a persistent application layout with:

Left Sidebar

Logo:
"Data Assistant"

Navigation grouped into:

ANALYTICS

Overview

Text-to-SQL

Dashboard

KNOWLEDGE

Document Q&A

ADMINISTRATION

Users

Data Sources

Knowledge Base

Glossary

Audit Log

At the bottom:

Settings

User profile

The active navigation item should be clearly highlighted.

Top Header

Include:

Breadcrumb

Current page title

Search

Notification icon

User avatar

User name

Role badge

ROUTES

Create these routes/pages:

/overview
/text-to-sql
/dashboard
/document-qa
/users
/data-sources
/knowledge-base
/glossary
/audit-log

MODULE 1 — TEXT-TO-SQL

Create a sophisticated AI Data Analyst interface.

Layout:

Left panel:

Conversation history

New conversation button

Recent conversations

Search conversations

Main area:

Chat messages

User question

AI response

Generated SQL

SQL validation

Self-correction

Query result

Visualization

Top of main area:

Page title: "Text-to-SQL Assistant"

Data source selector

Schema selector

Refresh button

The user should be able to type Vietnamese natural language questions.

Example:
"Doanh thu theo từng tháng trong năm 2026 là bao nhiêu?"

Show an AI response containing:

Natural language explanation

Generated SQL

SQL validation

Self-correction process

Query result

SQL Block

Create a polished code editor-like card.

Header:
"Generated SQL"

Buttons:

Copy

Edit

Execute

Display syntax-highlighted SQL.

Self-Correction Block

Create a collapsible panel titled:

"SQL Self-Correction"

Show:

Attempt 1
Status: Failed

Error:
"column amount does not exist"

Then:

Self-correction analysis:
"The column total_amount exists in the orders table."

Then:

Attempt 2
Status: Success

Use visual status indicators:

Success

Warning

Error

Processing

Query Result

Create tabs:

Table
Chart
SQL

Table should display realistic sales data.

Include:

pagination

column sorting

filtering

export button

Chart

Support:

Bar chart

Line chart

Pie chart

Include chart configuration controls:

Chart type

X-axis

Y-axis

Chat input

At the bottom:
large input field with placeholder:

"Đặt câu hỏi về dữ liệu của bạn..."

Include:

Send button

Attach/context button

Database selector

MODULE 2 — DASHBOARD

Create a business analytics dashboard.

Header:
"Business Dashboard"

Controls:

Date range

Data source

Refresh

Export

KPI cards:

Total Revenue

Total Orders

Active Customers

Average Order Value

Each KPI should include:

Current value

Percentage change

Comparison with previous period

Small trend indicator

Charts:

Revenue Over Time

Revenue by Category

Top Products

Orders by Region

Use realistic mock data.

Allow chart cards to have:

More options

Expand

Export

Add a "Last updated" indicator.

MODULE 3 — DOCUMENT Q&A / RAG

Create a document intelligence interface.

Use a three-column layout.

Left:
Document list

Middle:
AI chat

Right:
Source citation and PDF preview

Left Document Panel

Show documents:

Policy_2026.pdf

Sales_Regulations.pdf

HR_Handbook.pdf

Customer_Service_Policy.pdf

Each document should display:

file icon

name

page count

status

Include:
"+ Upload Document"

Chat

Title:
"Document Assistant"

Example question:

"Chính sách đổi trả sản phẩm trong bao lâu?"

AI answer should include citations such as:

[1] Policy_2026.pdf — Page 12

Citation should be clickable.

Source Citation Panel

When a citation is clicked, display:

Document name
Page number
Relevant excerpt
Relevance score

Example:

Source 1
Policy_2026.pdf
Page 12

Excerpt:
"Khách hàng được phép yêu cầu đổi sản phẩm trong vòng 07 ngày..."

Highlight the relevant text.

PDF Preview

Create a realistic PDF viewer mockup.

Toolbar:

Previous page

Next page

Page number

Zoom out

Zoom in

Search

Fullscreen

Show the selected page.

Highlight the source passage referenced by the AI answer.

The citation interaction should update the PDF preview to the correct page.

MODULE 4 — USER MANAGEMENT

Create an enterprise user management page.

Header:
"User Management"

Controls:

Search

Role filter

Status filter

Add User

Table columns:

User

Email

Role

Status

Last active

Created date

Actions

Roles:

Admin

Analyst

Viewer

Create Add/Edit User modal.

Fields:

Name

Email

Role

Status

Also create a permission section:

Permissions:

Query Database

View Dashboard

Query Documents

Manage Data Sources

Manage Knowledge Base

Manage Users

View Audit Logs

MODULE 5 — DATA SOURCES & SCHEMA

Create a Data Sources management page.

Show cards/table for connected databases.

Example:

PostgreSQL
Retail Database
12 tables
Connected

SQL Server
Sales Database
8 tables
Connected

Buttons:

Add Data Source

Test Connection

Edit

Delete

View Schema

Create an Add Data Source modal.

Fields:

Database type

Host

Port

Database name

Username

Password

For security, use password input.

Schema Explorer

Create a database schema browser.

Left:
Database
├── customers
├── orders
├── products
└── order_items

Right:
Selected table information.

Show:

Column name

Data type

Primary key

Foreign key

Nullable

Description

Also display table relationships visually.

MODULE 6 — KNOWLEDGE BASE

Create a Knowledge Base management page.

Show:

Total documents

Processing documents

Ready documents

Failed documents

Document table:

Document

Type

Size

Pages

Chunks

Processing status

Uploaded date

Actions

Statuses:

Processing

Ready

Failed

Clicking a document opens a detail panel showing:

Document information
Processing pipeline:

Uploaded
↓
Text extracted
↓
Chunked
↓
Embeddings generated
↓
Indexed

Use checkmarks for completed steps.

MODULE 7 — BUSINESS GLOSSARY

Create a Business Glossary page.

Purpose:
Map business terminology to database concepts and improve Text-to-SQL semantic understanding.

Table:

Term
Definition
Synonyms
Database Mapping
Status

Example:

"Doanh thu"
Definition:
"Tổng giá trị tiền của các đơn hàng hoàn tất."

Database Mapping:
orders.total_amount

Conditions:
orders.status = 'COMPLETED'

Synonyms:
DT
Revenue
Sales

Create Add/Edit Glossary Term modal.

Fields:

Term

Definition

Synonyms

Database mapping

Business rules

Examples

MODULE 8 — AUDIT LOG

Create an enterprise audit log page.

Filters:

Date range

User

Action

Resource

Status

Table:

Timestamp
User
Action
Resource
Status

Example actions:

Execute SQL

Query Document

Create User

Update Glossary

Add Data Source

Delete Document

Clicking a log should open a detail drawer.

For Text-to-SQL audit records show:

User question
Generated SQL
Self-correction attempts
Execution result
Execution time

For RAG audit records show:

User question
Retrieved documents
Sources
Answer
Response time

OVERVIEW PAGE

Create a professional overview page.

Show:

Total data sources

Total documents

Total queries

Query success rate

Recent activity list.

Quick actions:

Ask Data

Query Documents

Add Data Source

Upload Document

Also include a small "System Health" section.

INTERACTIONS

Implement realistic UI interactions using mock state.

Examples:

Clicking a citation changes PDF page.

Clicking "View Schema" opens schema explorer.

Clicking "Execute" changes SQL status to success.

Clicking "Self-Correction" expands correction details.

Switching Table / Chart updates result visualization.

Adding a glossary term updates the table.

Filters update displayed data.

Search works locally on mock data.

Modals can open and close.

Sidebar navigation changes routes.

Dashboard filters update charts using mock data.

IMPORTANT UI REQUIREMENTS

Do not make every page look identical.

Chat pages should prioritize conversational interaction.

Dashboard should prioritize visual analytics.

Administration pages should prioritize tables, filters and management actions.

RAG pages should prioritize document sources, citations and PDF preview.

Data Source pages should prioritize database structure and schema exploration.

Glossary should prioritize semantic/business metadata.

Audit Log should prioritize traceability.

Use realistic Vietnamese business terminology where appropriate.

The final product should look like a serious university graduation project / enterprise prototype that could realistically be presented to a company.

Do not use lorem ipsum.

Do not leave major sections empty.

Use realistic mock data throughout the application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5001b41f-4265-4e13-9425-384373cff849).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
