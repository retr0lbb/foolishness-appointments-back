import {connection} from "./client"


async function setUpDatabase(){
    try {
        connection.query("DROP TABLE IF EXISTS payments;")
        connection.query("DROP TABLE IF EXISTS appointments;")
        connection.query("DROP TABLE IF EXISTS specialization;")
        connection.query("DROP TABLE IF EXISTS doctors;")
        connection.query("DROP TABLE IF EXISTS patients;")
        connection.query("DROP TABLE IF EXISTS staff;")

        connection.query(`
            CREATE TABLE IF NOT EXISTS doctors (
                crm VARCHAR(255) PRIMARY KEY UNIQUE,
                phone VARCHAR(32) NOT NULL,
                name VARCHAR(255) NOT NULL
            );`)

        connection.query(`
            CREATE TABLE IF NOT EXISTS specialization (
                rqe INT PRIMARY KEY AUTO_INCREMENT,
                doctor_id VARCHAR(255) NOT NULL,
                FOREIGN KEY (doctor_id) REFERENCES doctors(crm)
            );`) 

        connection.query(`
            CREATE TABLE IF NOT EXISTS patients (
                cpf VARCHAR(255) PRIMARY KEY UNIQUE,
                phone VARCHAR(32) NOT NULL,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL
            );`)
            
        connection.query(`
            CREATE TABLE IF NOT EXISTS staff (
                code INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                job_function VARCHAR(255) NOT NULL
            );`)

        connection.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                patient_cpf VARCHAR(255) NOT NULL,
                doctor_crm VARCHAR(255) NOT NULL,
                staff_code INT NOT NULL,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_cpf) REFERENCES patients(cpf),
                FOREIGN KEY (doctor_crm) REFERENCES doctors(crm),
                FOREIGN KEY (staff_code) REFERENCES staff(code)
            );`)

        connection.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                value DECIMAL(10, 2) NOT NULL,
                payment_method VARCHAR(255) NOT NULL,
                appointment_id INT NOT NULL,
                FOREIGN KEY (appointment_id) REFERENCES appointments(id)
            );`)


        connection.end()

            console.log("all fine")
    } catch (error) {
        console.log(error)
    }
}

setUpDatabase()