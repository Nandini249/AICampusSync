// Initialize assignments from localStorage
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];

// Initialize the assignments functionality
function initializeAssignments() {
    const form = document.getElementById('assignmentForm');
    if (form) {
        form.addEventListener('submit', handleAssignmentSubmit);
        // Set minimum date to today
        const dueDateInput = document.getElementById('assignmentDueDate');
        if (dueDateInput) {
            dueDateInput.min = new Date().toISOString().split('T')[0];
        }
    }
    renderAssignments();
}

// Handle assignment form submission
function handleAssignmentSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('assignmentTitle').value;
    const description = document.getElementById('assignmentDescription').value;
    const dueDate = document.getElementById('assignmentDueDate').value;
    const priority = document.getElementById('assignmentPriority').value;

    const newAssignment = {
        id: Date.now(),
        title,
        description,
        dueDate,
        priority,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    assignments.push(newAssignment);
    localStorage.setItem('assignments', JSON.stringify(assignments));
    
    // Reset form
    e.target.reset();
    renderAssignments();
    showNotification('Assignment added successfully!', 'success');
}

// Render assignments
function renderAssignments(filter = 'all') {
    const assignmentsList = document.getElementById('assignmentsList');
    if (!assignmentsList) return;

    let filteredAssignments = assignments;
    if (filter === 'pending') {
        filteredAssignments = assignments.filter(a => a.status === 'pending');
    } else if (filter === 'completed') {
        filteredAssignments = assignments.filter(a => a.status === 'completed');
    }

    if (filteredAssignments.length === 0) {
        assignmentsList.innerHTML = `
            <div class="empty-state text-center py-5">
                <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                <p class="text-muted">No assignments found</p>
            </div>
        `;
        return;
    }

    assignmentsList.innerHTML = filteredAssignments
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .map(assignment => `
            <div class="card mb-3 assignment-card ${assignment.status === 'completed' ? 'completed' : ''}" 
                 data-id="${assignment.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="card-title mb-1">${assignment.title}</h6>
                            <p class="card-text text-muted small mb-2">${assignment.description}</p>
                            <div class="d-flex align-items-center gap-2">
                                <span class="badge bg-${getPriorityColor(assignment.priority)}">
                                    ${assignment.priority}
                                </span>
                                <span class="text-muted small">
                                    <i class="fas fa-calendar-alt me-1"></i>
                                    Due: ${formatDate(assignment.dueDate)}
                                </span>
                            </div>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary" 
                                    onclick="toggleAssignmentStatus(${assignment.id})">
                                <i class="fas fa-${assignment.status === 'completed' ? 'undo' : 'check'}"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" 
                                    onclick="deleteAssignment(${assignment.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
}

// Filter assignments
function filterAssignments(filter) {
    renderAssignments(filter);
}

// Toggle assignment status
function toggleAssignmentStatus(id) {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        assignment.status = assignment.status === 'completed' ? 'pending' : 'completed';
        localStorage.setItem('assignments', JSON.stringify(assignments));
        renderAssignments();
        showNotification(
            `Assignment marked as ${assignment.status}!`,
            assignment.status === 'completed' ? 'success' : 'info'
        );
    }
}

// Delete assignment
function deleteAssignment(id) {
    if (confirm('Are you sure you want to delete this assignment?')) {
        assignments = assignments.filter(a => a.id !== id);
        localStorage.setItem('assignments', JSON.stringify(assignments));
        renderAssignments();
        showNotification('Assignment deleted successfully!', 'success');
    }
}

// Helper function to get priority color
function getPriorityColor(priority) {
    switch (priority) {
        case 'high': return 'danger';
        case 'medium': return 'warning';
        case 'low': return 'success';
        default: return 'secondary';
    }
}

// Helper function to format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAssignments); 