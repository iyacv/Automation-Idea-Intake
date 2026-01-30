Frontend

📂 src/pages
submitpage.tsx -
landing page "submit idea" fill out idea form

AdminDashboard.tsx -
portal admin tab para view ng charts/dashboard

LogsPage.tsx -
view ng activity logs tab

📂 src/components (ui elements)
Header.tsx -
top navigation bar w logo and the tabs (Submit, Admin, Logs)

IdeaForm.tsx -
input form na makikita sa submit idea tab

IdeaTable.tsx -
display of ideas in a table format(sa admin dashboard)

IdeaDetailModal.tsx -
pop up window kapag admin clicks "view details" to review all submitted idea

Charts.tsx -
for bar donts chart sa dashboard

📂 src/models
idea.ts -
idea title, description, current process problems, departments involved, and admin review fields (classification, priority).

user.ts -
User ID, name, email, and roles (Submitter or Admin).

auditlog.ts -
record for what action wwas performed , who and what time

workflow.ts -  
manages status (submitted > under review > approved/rejected)

classification.ts -
categorization ng type if automation, process improvement, operational enhancement

evaluationscore.ts -
scoring logic

📂 src/services
IdeaService.ts -
saving new idea, update status, calculate ng statistics for dashboard chart

AuthService.ts -
login/logout

AuditService.ts -
will trigger every time a status change to save log entry

ClassificationService.ts -
analyze to suggest kung ung idea is automation of process improvements etc.

EvaluationService.ts - (draft, changes all)
asssigning scoring

WorkflowService.ts -
ensuring ideas follow correct approval sequence
