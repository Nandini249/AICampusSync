from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

# MySQL Database Configuration
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="yourpassword",  # Ensure this is correct
    database="AI_CampusSync"
)


cursor = db.cursor()

# ✅ Route to Fetch User's Timetable
@app.route("/timetable/<user_id>", methods=["GET"])
def get_timetable(user_id):
    cursor.execute("SELECT * FROM Timetable WHERE user_id = %s", (user_id,))
    timetable = cursor.fetchall()
    return jsonify(timetable)

# ✅ Route to Add Task to To-Do List
@app.route("/todo", methods=["POST"])
def add_task():
    data = request.json
    cursor.execute("INSERT INTO ToDoList (user_id, task) VALUES (%s, %s)", (data["user_id"], data["task"]))
    db.commit()
    return jsonify({"message": "Task added successfully!"})

# ✅ Route to Mark Task as Completed (Remove from To-Do)
@app.route("/todo/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    cursor.execute("DELETE FROM ToDoList WHERE task_id = %s", (task_id,))
    db.commit()
    return jsonify({"message": "Task removed successfully!"})

# ✅ Route to Update Attendance
@app.route("/attendance", methods=["POST"])
def update_attendance():
    data = request.json
    cursor.execute("INSERT INTO Attendance (user_id, subject, attended) VALUES (%s, %s, %s)", 
                   (data["user_id"], data["subject"], data["attended"]))
    db.commit()
    return jsonify({"message": "Attendance updated successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
