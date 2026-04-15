export const authMe = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ ok: false, message: "User not found" });
        }
        const userToReturn = { ...user._doc };
        if (userToReturn.passwordHash) {
            delete userToReturn.passwordHash;
        }

        return res.status(200).json({ ok: true, user: userToReturn });
    } catch (error) {
        console.error("Error in authMe:", error);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};
