import {getConnection} from "./client"


async function setUpDatabase(){
    const conn = await getConnection()
    try {
        conn.query("DROP TABLE IF EXISTS payments;")
        conn.query("DROP TABLE IF EXISTS appointments;")
        conn.query("DROP TABLE IF EXISTS specialization;")
        conn.query("DROP TABLE IF EXISTS doctors;")
        conn.query("DROP TABLE IF EXISTS patients;")
        conn.query("DROP TABLE IF EXISTS staff;")

        conn.query(`
            CREATE TABLE IF NOT EXISTS doctors (
                id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())), 
                crm VARCHAR(255) UNIQUE,
                phone VARCHAR(32) NOT NULL,
                name VARCHAR(255) NOT NULL
            );`)

        conn.query(`
            CREATE TABLE IF NOT EXISTS specialization (
                id INT PRIMARY KEY AUTO_INCREMENT,
                rqe VARCHAR(255) NOT NULL
            );`) 

        conn.query(`
            CREATE TABLE IF NOT EXISTS doctor_specialization(
                id INT PRIMARY KEY AUTO_INCREMENT,
                doctor_id BINARY(16) NOT NULL,
                specialization_id INT NOT NULL,

                FOREIGN KEY (doctor_id) REFERENCES doctors(id),
                FOREIGN KEY (specialization_id) REFERENCES specialization(id)
            )
            `)

        conn.query(`
            CREATE TABLE IF NOT EXISTS patients (
                id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())), 
                cpf VARCHAR(255) UNIQUE,
                phone VARCHAR(32) NOT NULL,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL
            );`)
            
        conn.query(`
            CREATE TABLE IF NOT EXISTS staff (
                code INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                job_function VARCHAR(255) NOT NULL
            );`)

        conn.query(`
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

        conn.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())), 
                value DECIMAL(10, 2) NOT NULL,
                payment_method VARCHAR(255) NOT NULL,
                appointment_id INT NOT NULL,
                FOREIGN KEY (appointment_id) REFERENCES appointments(id)
            );`)


        conn.end()
        console.log("all fine")
    } catch (error) {
        console.log(error)
    }
}

setUpDatabase()