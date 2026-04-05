import User from "../models/User.js";

export const seedAdmin = async () => {
    try {
        const adminEmail = "epremium@gmail.com";
        const adminPassword = "epremium";

        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (!existingAdmin) {
            console.log("No admin found. Creating default admin account...");
            
            const newAdmin = new User({
                name: "System Admin",
                email: adminEmail,
                password: adminPassword,
                role: "admin",
                is_active: true // Auto-activate the first admin
            });

            await newAdmin.save();
            console.log("Default admin created: epremium@gmail.com / epremium");
        } else {
            console.log("Admin account already exists.");
        }
    } catch (error) {
        console.error("Error seeding admin:", error.message);
    }
};
