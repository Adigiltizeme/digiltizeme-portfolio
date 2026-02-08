import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const appointmentAPI = {
    // Public endpoints
    getAvailableSlots: async (startDate, endDate, meetingType = null, includeBooked = false) => {
        const params = new URLSearchParams({
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        });
        if (meetingType) params.append('meetingType', meetingType);
        if (includeBooked) params.append('includeBooked', 'true');

        const response = await axios.get(`${API_URL}/appointments/available?${params}`);
        return response.data;
    },

    bookAppointment: async (appointmentData) => {
        const response = await axios.post(`${API_URL}/appointments/book`, appointmentData);
        return response.data;
    },

    // Admin endpoints
    getAllAppointments: async (token, status = null) => {
        const params = status ? `?status=${status}` : '';
        const response = await axios.get(`${API_URL}/appointments${params}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    getUpcomingAppointments: async (token) => {
        const response = await axios.get(`${API_URL}/appointments/upcoming`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    updateAppointmentStatus: async (token, id, status) => {
        const response = await axios.patch(
            `${API_URL}/appointments/${id}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    createSlot: async (token, slotData) => {
        const response = await axios.post(`${API_URL}/appointments/slots`, slotData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    createRecurringSlots: async (token, recurringData) => {
        const response = await axios.post(
            `${API_URL}/appointments/slots/recurring`,
            recurringData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },

    deleteSlot: async (token, id) => {
        const response = await axios.delete(`${API_URL}/appointments/slots/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    deleteSlotsBulk: async (token, ids) => {
        const response = await axios.delete(`${API_URL}/appointments/slots/bulk`, {
            data: { ids },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    cleanupDuplicates: async (token) => {
        const response = await axios.post(`${API_URL}/appointments/slots/cleanup`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    getAvailabilitySettings: async (token) => {
        const response = await axios.get(`${API_URL}/appointments/settings`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    updateAvailabilitySettings: async (token, settings) => {
        const response = await axios.patch(`${API_URL}/appointments/settings`, settings, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};
