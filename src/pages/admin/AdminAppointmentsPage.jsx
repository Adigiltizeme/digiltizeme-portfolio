import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, X, User, Phone, Mail, Settings, Plus, Trash2 } from 'lucide-react';
import { format, parseISO, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { appointmentAPI } from '../../api/appointments';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [availabilitySettings, setAvailabilitySettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, all, slots, settings
    const [selectedRecurringDays, setSelectedRecurringDays] = useState([1, 2, 3, 4, 5]); // Default Mon-Fri

    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (activeTab === 'upcoming') {
            fetchUpcomingAppointments();
        } else if (activeTab === 'all') {
            fetchAllAppointments();
        } else if (activeTab === 'slots') {
            fetchSlots();
        } else if (activeTab === 'settings') {
            fetchSettings();
        }
    }, [activeTab]);

    const fetchUpcomingAppointments = async () => {
        setLoading(true);
        try {
            const data = await appointmentAPI.getUpcomingAppointments(token);
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllAppointments = async () => {
        setLoading(true);
        try {
            const data = await appointmentAPI.getAllAppointments(token);
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSlots = async () => {
        setLoading(true);
        try {
            // Fetch for the next 30 days
            const start = new Date();
            const end = addDays(start, 30);
            const data = await appointmentAPI.getAvailableSlots(start, end, null, true);
            setAvailableSlots(data);
        } catch (error) {
            console.error('Error fetching slots:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const data = await appointmentAPI.getAvailabilitySettings(token);
            setAvailabilitySettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm('Supprimer ce créneau ?')) return;
        try {
            await appointmentAPI.deleteSlot(token, id);
            fetchSlots();
        } catch (error) {
            console.error('Error deleting slot:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const handleDeleteSlotsBulk = async (ids, message = 'Supprimer ces créneaux ?') => {
        if (!ids || ids.length === 0) return;
        if (!window.confirm(message)) return;

        setLoading(true);
        try {
            const res = await appointmentAPI.deleteSlotsBulk(token, ids);
            alert(res.message);
            fetchSlots();
        } catch (error) {
            console.error('Error deleting slots bulk:', error);
            alert('Erreur: ' + (error.response?.data?.message || 'Inconnue'));
        } finally {
            setLoading(false);
        }
    };

    const handleCleanupDuplicates = async () => {
        if (!window.confirm('Voulez-vous fusionner et nettoyer les créneaux en double ? (Les réservations existantes seront conservées)')) return;
        setLoading(true);
        try {
            const res = await appointmentAPI.cleanupDuplicates(token);
            alert(res.message);
            fetchSlots();
        } catch (error) {
            console.error('Error cleaning duplicates:', error);
            alert('Erreur: ' + (error.response?.data?.message || 'Inconnue'));
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await appointmentAPI.updateAppointmentStatus(token, id, status);
            // Refresh list
            if (activeTab === 'upcoming') {
                fetchUpcomingAppointments();
            } else {
                fetchAllAppointments();
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await appointmentAPI.updateAvailabilitySettings(token, availabilitySettings);
            alert('Paramètres enregistrés avec succès !');
            fetchSettings();
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Erreur lors de l\'enregistrement des paramètres');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateIndividualSlot = async (e) => {
        e.preventDefault();
        const date = e.target.slotDate.value;
        const start = e.target.startTime.value;
        const end = e.target.endTime.value;
        const meetingType = e.target.meetingType.value;

        if (!date || !start || !end) return alert('Veuillez remplir tous les champs');

        setLoading(true);
        try {
            const startTime = new Date(`${date}T${start}`).toISOString();
            const endTime = new Date(`${date}T${end}`).toISOString();

            await appointmentAPI.createSlot(token, {
                startTime,
                endTime,
                meetingType,
                isRecurring: false
            });

            alert('Créneau créé !');
            fetchSlots();
        } catch (error) {
            console.error('Error creating slot:', error);
            alert('Erreur: ' + (error.response?.data?.message || 'Inconnue'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
            CONFIRMED: 'bg-green-500/20 text-green-300 border-green-500/40',
            CANCELLED: 'bg-red-500/20 text-red-300 border-red-500/40',
            COMPLETED: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
            NO_SHOW: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
        };

        const labels = {
            PENDING: 'En attente',
            CONFIRMED: 'Confirmé',
            CANCELLED: 'Annulé',
            COMPLETED: 'Terminé',
            NO_SHOW: 'Absent',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary-500/30">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none" />

            {/* Sidebar Navigation */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="lg:ml-72 min-h-screen p-4 lg:p-12 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-black mb-2">Gestion des Rendez-vous</h1>
                        <p className="text-gray-400">Gérez vos consultations clients et créneaux de disponibilité</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8 border-b border-white/20">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-6 py-3 font-bold transition-colors border-b-2 ${activeTab === 'upcoming'
                                ? 'border-orange-500 text-white'
                                : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            Prochains RDV
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-6 py-3 font-bold transition-colors border-b-2 ${activeTab === 'all'
                                ? 'border-orange-500 text-white'
                                : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            Tous les RDV
                        </button>
                        <button
                            onClick={() => setActiveTab('slots')}
                            className={`px-6 py-3 font-bold transition-colors border-b-2 ${activeTab === 'slots'
                                ? 'border-orange-500 text-white'
                                : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            Disponibilités
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-6 py-3 font-bold transition-colors border-b-2 ${activeTab === 'settings'
                                ? 'border-orange-500 text-white'
                                : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            <Settings size={18} className="inline mr-2" />
                            Paramètres
                        </button>
                    </div>

                    {/* Content */}
                    {(activeTab === 'upcoming' || activeTab === 'all') && (
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-12 text-gray-500">Chargement...</div>
                            ) : appointments.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Aucun rendez-vous trouvé</p>
                                </div>
                            ) : (
                                appointments.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="bg-urban-gray/30 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                                    <Calendar className="text-orange-500" size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-white">{appointment.clientName}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} className="text-orange-400" />
                                                            {format(parseISO(appointment.slot.startTime), "EEEE d MMMM 'à' HH:mm", { locale: fr })}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Mail size={14} className="text-orange-400" />
                                                            {appointment.clientEmail}
                                                        </span>
                                                        {appointment.clientPhone && (
                                                            <span className="flex items-center gap-1">
                                                                <Phone size={14} className="text-orange-400" />
                                                                {appointment.clientPhone}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {appointment.notes && (
                                                        <p className="text-sm text-gray-400 mt-2 italic border-l-2 border-orange-500/30 pl-3">"{appointment.notes}"</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(appointment.status)}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {appointment.status === 'PENDING' && (
                                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                                <button
                                                    onClick={() => handleStatusChange(appointment.id, 'CONFIRMED')}
                                                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2"
                                                >
                                                    <Check size={16} />
                                                    Confirmer
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(appointment.id, 'CANCELLED')}
                                                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                                                >
                                                    <X size={16} />
                                                    Annuler
                                                </button>
                                            </div>
                                        )}

                                        {appointment.status === 'CONFIRMED' && (
                                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                                                <button
                                                    onClick={() => handleStatusChange(appointment.id, 'COMPLETED')}
                                                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                                                >
                                                    <Check size={16} />
                                                    Marquer comme terminé
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(appointment.id, 'NO_SHOW')}
                                                    className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
                                                >
                                                    Absent
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'slots' && (
                        <div className="space-y-8">
                            {/* Generation Form */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Individual Slot Form */}
                                <div className="bg-urban-gray/30 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Plus className="text-orange-500" size={20} />
                                        Créer un créneau unique
                                    </h3>
                                    <form onSubmit={handleCreateIndividualSlot} className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-300 font-bold mb-2">Date</label>
                                            <input
                                                type="date"
                                                name="slotDate"
                                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none placeholder:text-gray-500"
                                                defaultValue={format(new Date(), 'yyyy-MM-dd')}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-300 font-bold mb-2">Début</label>
                                                <input
                                                    type="time"
                                                    name="startTime"
                                                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                                                    defaultValue="09:00"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-300 font-bold mb-2">Fin</label>
                                                <input
                                                    type="time"
                                                    name="endTime"
                                                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                                                    defaultValue="09:30"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-300 font-bold mb-2">Type</label>
                                            <select
                                                name="meetingType"
                                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                                            >
                                                <option value="DISCOVERY" className="bg-urban-gray text-white">Découverte (30 min)</option>
                                                <option value="CONSULTATION" className="bg-urban-gray text-white">Consultation (60 min)</option>
                                                <option value="STRATEGY" className="bg-urban-gray text-white">Stratégie (90 min)</option>
                                            </select>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-all border border-white/5"
                                        >
                                            Créer le créneau
                                        </button>
                                    </form>
                                </div>

                                {/* Recurring Generation Form */}
                                <div className="bg-urban-gray/30 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Plus className="text-orange-500" size={20} />
                                        Générer des créneaux récurrents
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm text-gray-300 font-bold mb-2">À partir du</label>
                                                <input
                                                    type="date"
                                                    id="baseDate"
                                                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                                                    defaultValue={format(new Date(), 'yyyy-MM-dd')}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-300 font-bold mb-2">Nb semaines</label>
                                                <input
                                                    type="number"
                                                    id="weeksCount"
                                                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                                                    defaultValue="4"
                                                    min="1"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-300 font-bold mb-2">Jours de la semaine</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((label, idx) => (
                                                    <button
                                                        key={label}
                                                        type="button"
                                                        onClick={() => {
                                                            if (selectedRecurringDays.includes(idx)) {
                                                                setSelectedRecurringDays(selectedRecurringDays.filter(d => d !== idx));
                                                            } else {
                                                                setSelectedRecurringDays([...selectedRecurringDays, idx]);
                                                            }
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${selectedRecurringDays.includes(idx)
                                                            ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20'
                                                            : 'bg-white/10 text-gray-300 border-white/10 hover:border-white/20'
                                                            }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <button
                                            onClick={async () => {
                                                const baseDate = document.getElementById('baseDate').value;
                                                const weeksCount = parseInt(document.getElementById('weeksCount').value);

                                                if (!baseDate || !weeksCount || selectedRecurringDays.length === 0)
                                                    return alert('Veuillez remplir les champs et sélectionner au moins un jour');

                                                if (!availabilitySettings) return alert('Paramètres non chargés');

                                                if (!window.confirm(`Générer des créneaux selon vos paramètres d'ouverture ?`)) return;

                                                setLoading(true);
                                                try {
                                                    // Calculate time slots based on settings
                                                    const slots = [];
                                                    const startMinutes = parseInt(availabilitySettings.workingHoursStart.split(':')[0]) * 60 + parseInt(availabilitySettings.workingHoursStart.split(':')[1]);
                                                    const endMinutes = parseInt(availabilitySettings.workingHoursEnd.split(':')[0]) * 60 + parseInt(availabilitySettings.workingHoursEnd.split(':')[1]);
                                                    const totalSlotTime = availabilitySettings.slotDuration + availabilitySettings.bufferTime;

                                                    for (let m = startMinutes; m + availabilitySettings.slotDuration <= endMinutes; m += totalSlotTime) {
                                                        const h = Math.floor(m / 60).toString().padStart(2, '0');
                                                        const min = (m % 60).toString().padStart(2, '0');
                                                        const eh = Math.floor((m + availabilitySettings.slotDuration) / 60).toString().padStart(2, '0');
                                                        const emin = ((m + availabilitySettings.slotDuration) % 60).toString().padStart(2, '0');

                                                        slots.push({
                                                            start: `${h}:${min}`,
                                                            end: `${eh}:${emin}`,
                                                            meetingType: 'DISCOVERY'
                                                        });
                                                    }

                                                    const res = await appointmentAPI.createRecurringSlots(token, {
                                                        baseDate: new Date(baseDate).toISOString(),
                                                        weeksCount,
                                                        daysOfWeek: selectedRecurringDays,
                                                        timeSlots: slots
                                                    });

                                                    alert(res.message || 'Créneaux générés !');
                                                    fetchSlots();
                                                } catch (error) {
                                                    console.error('Generation error:', error);
                                                    alert('Erreur lors de la génération: ' + (error.response?.data?.message || 'Inconnue'));
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                                        >
                                            Générer les sessions types
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Slots List */}
                            <div className="bg-urban-gray/30 border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Clock className="text-orange-500" size={20} />
                                        Liste des créneaux ({availableSlots.length} au total)
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        {availableSlots.length > 0 && (
                                            <>
                                                <button
                                                    onClick={handleCleanupDuplicates}
                                                    className="px-4 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-xl hover:bg-orange-500/20 transition-all font-bold text-sm flex items-center gap-2"
                                                    title="Supprime les créneaux identiques"
                                                >
                                                    <Check size={16} />
                                                    Nettoyer les doublons
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSlotsBulk(
                                                        availableSlots.filter(s => !s.isBooked).map(s => s.id),
                                                        'Voulez-vous supprimer TOUS les créneaux disponibles (non réservés) ?'
                                                    )}
                                                    className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all font-bold text-sm flex items-center gap-2"
                                                >
                                                    <Trash2 size={16} />
                                                    Vider tout le calendrier
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {loading ? (
                                    <div className="text-center py-12 text-gray-500">Chargement...</div>
                                ) : availableSlots.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-xl">
                                        Aucun créneau disponible. Utilisez le formulaire ci-dessus pour en générer.
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {Object.entries(availableSlots.reduce((acc, slot) => {
                                            const dateKey = format(parseISO(slot.startTime), 'yyyy-MM-dd');
                                            if (!acc[dateKey]) acc[dateKey] = [];
                                            acc[dateKey].push(slot);
                                            return acc;
                                        }, {})).sort((a, b) => a[0].localeCompare(b[0])).map(([date, slots]) => (
                                            <div key={date} className="border-l-2 border-orange-500/30 pl-6 py-2">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-black text-white capitalize">
                                                        {format(parseISO(date), 'EEEE d MMMM yyyy', { locale: fr })}
                                                    </h4>
                                                    <button
                                                        onClick={() => handleDeleteSlotsBulk(
                                                            slots.filter(s => !s.isBooked).map(s => s.id),
                                                            `Supprimer tous les créneaux libres du ${format(parseISO(date), 'd MMMM', { locale: fr })} ?`
                                                        )}
                                                        className="text-xs font-bold text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5 hover:border-red-500/30"
                                                    >
                                                        <Trash2 size={12} />
                                                        Supprimer le groupe
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                    {slots.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((slot) => (
                                                        <div
                                                            key={slot.id}
                                                            className={`bg-zinc-900/50 border rounded-xl p-3 flex items-center justify-between group transition-all ${slot.isBooked
                                                                ? 'border-red-500/20 opacity-90'
                                                                : 'border-white/5 hover:border-orange-500/30'
                                                                }`}
                                                        >
                                                            <div>
                                                                <div className={`text-sm font-bold flex items-center gap-2 ${slot.isBooked ? 'text-red-400' : 'text-orange-400'}`}>
                                                                    <Clock size={12} />
                                                                    {format(parseISO(slot.startTime), 'HH:mm')} - {format(parseISO(slot.endTime), 'HH:mm')}
                                                                </div>
                                                                <div className="flex gap-2 mt-1">
                                                                    <span className="text-[9px] uppercase font-black text-gray-500 tracking-tighter">
                                                                        {slot.meetingType}
                                                                    </span>
                                                                    {slot.isBooked && (
                                                                        <span className="text-[9px] text-red-500 font-black uppercase">
                                                                            RÉSERVÉ
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {!slot.isBooked && (
                                                                <button
                                                                    onClick={() => handleDeleteSlot(slot.id)}
                                                                    className="p-1.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg"
                                                                    title="Supprimer"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && availabilitySettings && (
                        <div className="space-y-6">
                            <div className="bg-urban-gray/30 border border-orange-500/20 rounded-2xl p-6">
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-orange-400">
                                    <Settings size={20} />
                                    Comment fonctionnent les paramètres ?
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Vos <strong>Heures de début/fin</strong>, <strong>Durée</strong> et <strong>Buffer</strong> servent de modèle (blueprint)
                                    pour la génération des créneaux dans l'onglet <span className="text-orange-300">Disponibilités</span>.
                                    <br /><br />
                                    • Toute modification ici n'affectera pas les créneaux déjà générés ou réservés.<br />
                                    • Pour appliquer de nouveaux horaires, vous devez vider les créneaux existants et en générer de nouveaux.<br />
                                    • Les réglages ici garantissent que vos futures générations respectent la structure de vos journées.
                                </p>
                            </div>

                            <div className="bg-urban-gray/30 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-2xl font-bold mb-6">Paramètres de Disponibilité</h3>

                                <form onSubmit={handleSaveSettings} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-black text-gray-300 mb-2">Heure de début de journée</label>
                                            <input
                                                type="time"
                                                value={availabilitySettings.workingHoursStart}
                                                onChange={(e) => setAvailabilitySettings({ ...availabilitySettings, workingHoursStart: e.target.value })}
                                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-gray-300 mb-2">Heure de fin de journée</label>
                                            <input
                                                type="time"
                                                value={availabilitySettings.workingHoursEnd}
                                                onChange={(e) => setAvailabilitySettings({ ...availabilitySettings, workingHoursEnd: e.target.value })}
                                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-black text-gray-300 mb-2">Durée (minutes)</label>
                                            <input
                                                type="number"
                                                value={availabilitySettings.slotDuration}
                                                onChange={(e) => setAvailabilitySettings({ ...availabilitySettings, slotDuration: parseInt(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-gray-300 mb-2">Buffer (minutes)</label>
                                            <input
                                                type="number"
                                                value={availabilitySettings.bufferTime}
                                                onChange={(e) => setAvailabilitySettings({ ...availabilitySettings, bufferTime: parseInt(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-black text-gray-300 mb-2">Slots max / jour</label>
                                            <input
                                                type="number"
                                                value={availabilitySettings.maxDailySlots}
                                                onChange={(e) => setAvailabilitySettings({ ...availabilitySettings, maxDailySlots: parseInt(e.target.value) })}
                                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-black text-gray-300 mb-4">Jours de travail</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                                                const isWorking = availabilitySettings.workingDaysJson[day];
                                                const labels = {
                                                    monday: 'Lundi',
                                                    tuesday: 'Mardi',
                                                    wednesday: 'Mercredi',
                                                    thursday: 'Jeudi',
                                                    friday: 'Vendredi',
                                                    saturday: 'Samedi',
                                                    sunday: 'Dimanche'
                                                };
                                                return (
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() => {
                                                            const newDays = { ...availabilitySettings.workingDaysJson, [day]: !isWorking };
                                                            setAvailabilitySettings({ ...availabilitySettings, workingDaysJson: newDays });
                                                        }}
                                                        className={`p-3 rounded-xl text-center text-sm font-bold transition-all border ${isWorking
                                                            ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                                                            : 'bg-white/10 text-gray-400 border-white/10 hover:border-white/20'
                                                            }`}
                                                    >
                                                        <div className="capitalize">{labels[day]}</div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/10">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                                        >
                                            {loading ? 'Enregistrement...' : 'Sauvegarder les paramètres'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminAppointmentsPage;
