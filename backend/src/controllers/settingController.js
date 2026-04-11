import Setting from '../models/Setting.js';

import fs from 'fs';

export const getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne({ singletonKey: "default" });
        
        if (!settings) {
            settings = new Setting({ singletonKey: "default" });
            await settings.save();
        }

        res.status(200).json({ ok: true, settings });
    } catch (error) {
        fs.writeFileSync('/tmp/setting-error.log', String(error) + '\n' + error.stack);
        console.error("Error fetching settings:", error);
        res.status(500).json({ ok: false, message: 'Failed to fetch settings' });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { shipperFee, dollarsPerPoint, minimumPointsToRedeem, pickupAddress } = req.body;

        let settings = await Setting.findOne({ singletonKey: "default" });
        if (!settings) {
            settings = new Setting({ singletonKey: "default" });
        }

        if (shipperFee !== undefined) settings.shipperFee = shipperFee;
        if (dollarsPerPoint !== undefined) settings.dollarsPerPoint = dollarsPerPoint;
        if (minimumPointsToRedeem !== undefined) settings.minimumPointsToRedeem = minimumPointsToRedeem;
        if (pickupAddress !== undefined) settings.pickupAddress = pickupAddress;

        await settings.save();

        res.status(200).json({ ok: true, message: 'Settings updated successfully', settings });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ ok: false, message: 'Failed to update settings' });
    }
};
