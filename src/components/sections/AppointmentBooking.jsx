import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Check, Mail, Phone, User, Building2, FileText } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { appointmentAPI } from '../../api/appointments';
import { submitAppointment } from '../utils/formHandler';

const AppointmentBooking = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, booking, success, error
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        notes: '',
    });

    // Fetch available slots for selected week
    useEffect(() => {
        fetchAvailableSlots();
    }, [selectedDate]);

    const fetchAvailableSlots = async () => {
        setLoading(true);
        try {
            const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
            const endDate = addDays(startDate, 6); // Sunday

            // We include booked slots so users see them as 'occupied'
            const slots = await appointmentAPI.getAvailableSlots(startDate, endDate, null, true);
            console.log('📅 Fetched slots (incl. booked):', slots);
            setAvailableSlots(Array.isArray(slots) ? slots : []);
        } catch (error) {
            console.error('Error fetching slots:', error);
            setAvailableSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!selectedSlot || !formData.clientName || !formData.clientEmail) {
            alert('Merci de remplir tous les champs obligatoires');
            return;
        }

        setStatus('booking');
        try {
            const response = await appointmentAPI.bookAppointment({
                ...formData,
                slotId: selectedSlot.id,
            });

            // Send Email Notification
            try {
                await submitAppointment({
                    ...formData,
                    appointmentDate: format(parseISO(selectedSlot.startTime), "EEEE d MMMM 'à' HH:mm", { locale: fr }),
                    meetingType: selectedSlot.meetingType
                });
            } catch (emailError) {
                console.error('Email notification failed but booking succeeded:', emailError);
            }

            setStatus('success');
        } catch (error) {
            console.error('Booking error:', error);
            setStatus('error');
            alert('Erreur lors de la réservation. Veuillez réessayer.');
        }
    };

    const getSlotsForDate = (date) => {
        if (!Array.isArray(availableSlots)) return [];
        return availableSlots.filter((slot) =>
            isSameDay(parseISO(slot.startTime), date)
        );
    };

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
        return addDays(start, i);
    });

    if (status === 'success') {
        return (
            <div className="max-w-4xl mx-auto py-12 px-6">
                <div className="bg-urban-gray/50 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-sm">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                        <Check size={40} className="text-white" />
                    </div>
                    <h3 className="text-3xl font-black mb-4">Rendez-vous Confirmé !</h3>
                    <p className="text-gray-400 text-lg mb-4">
                        Merci {formData.clientName}. Votre consultation est programmée pour le{' '}
                        <span className="text-white font-bold">
                            {format(parseISO(selectedSlot.startTime), "EEEE d MMMM 'à' HH:mm", { locale: fr })}
                        </span>
                    </p>
                    <p className="text-sm text-gray-500 mb-8">
                        Un email de confirmation a été envoyé à {formData.clientEmail}
                    </p>
                    <button
                        onClick={() => {
                            setStatus('idle');
                            setSelectedSlot(null);
                            setFormData({ clientName: '', clientEmail: '', clientPhone: '', notes: '' });
                        }}
                        className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                    >
                        Nouvelle réservation
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-6">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
                    Planifiez Votre <span className="text-orange-500">Consultation</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Rendez-vous gratuit de 30 minutes pour discuter de votre projet
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Calendar Section */}
                <div className="bg-urban-gray/30 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar size={24} className="text-orange-500" />
                        Choisissez une date
                    </h3>

                    {/* Week Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => setSelectedDate(addWeeks(selectedDate, -1))}
                            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            ← Semaine précédente
                        </button>
                        <span className="text-sm text-gray-400">
                            {format(weekDays[0], 'd MMM', { locale: fr })} - {format(weekDays[6], 'd MMM yyyy', { locale: fr })}
                        </span>
                        <button
                            onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
                            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            Semaine suivante →
                        </button>
                    </div>

                    {/* Day Slots */}
                    <div className="space-y-3">
                        {weekDays.map((day) => {
                            const daySlots = getSlotsForDate(day);
                            const isToday = isSameDay(day, new Date());

                            return (
                                <div
                                    key={day.toISOString()}
                                    className={`p-4 rounded-xl border transition-all ${isToday
                                        ? 'border-orange-500/50 bg-orange-500/10'
                                        : 'border-white/10 bg-black/20'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-bold text-white uppercase tracking-wider text-sm">
                                            {format(day, 'EEEE d MMM', { locale: fr })}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {daySlots.filter(s => !s.isBooked).length} créneaux disponibles
                                        </span>
                                    </div>

                                    {daySlots.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {daySlots.map((slot) => (
                                                <button
                                                    key={slot.id}
                                                    onClick={() => !slot.isBooked && setSelectedSlot(slot)}
                                                    disabled={slot.isBooked}
                                                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all border ${slot.isBooked
                                                        ? 'bg-red-500/5 text-red-500/40 border-red-500/10 cursor-not-allowed'
                                                        : selectedSlot?.id === slot.id
                                                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50 border-orange-400'
                                                            : 'bg-white/10 text-gray-200 border-white/10 hover:bg-white/20 hover:border-white/30'
                                                        }`}
                                                >
                                                    {format(parseISO(slot.startTime), 'HH:mm')}
                                                    {slot.isBooked && <span className="text-[10px] ml-1 opacity-50 uppercase tracking-tighter">Occ</span>}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500 italic py-2">Aucun créneau disponible</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Booking Form */}
                <div className="bg-urban-gray/30 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <User size={24} className="text-orange-500" />
                        Vos informations
                    </h3>

                    {selectedSlot ? (
                        <>
                            <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                                <p className="text-sm text-gray-400 mb-1">Créneau sélectionné :</p>
                                <p className="font-bold text-white">
                                    {format(parseISO(selectedSlot.startTime), "EEEE d MMMM 'à' HH:mm", { locale: fr })}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Durée : {Math.round((new Date(selectedSlot.endTime) - new Date(selectedSlot.startTime)) / 60000)} minutes
                                </p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-xs font-black text-gray-300 uppercase ml-1 mb-2 block tracking-widest">
                                        Nom complet *
                                    </label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-3.5 text-orange-500/70" />
                                        <input
                                            type="text"
                                            placeholder="Prénom et nom"
                                            value={formData.clientName}
                                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                            className="w-full bg-white/5 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-300 uppercase ml-1 mb-2 block tracking-widest">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-3.5 text-orange-500/70" />
                                        <input
                                            type="email"
                                            placeholder="votre@email.com"
                                            value={formData.clientEmail}
                                            onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                            className="w-full bg-white/5 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-black text-gray-300 uppercase ml-1 mb-2 block tracking-widest">
                                        Téléphone
                                    </label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-4 top-3.5 text-orange-500/70" />
                                        <input
                                            type="tel"
                                            placeholder="06 12 34 56 78"
                                            value={formData.clientPhone}
                                            onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 mb-1 block">
                                        Message (optionnel)
                                    </label>
                                    <div className="relative">
                                        <FileText size={18} className="absolute left-4 top-3.5 text-orange-500/70" />
                                        <textarea
                                            rows={3}
                                            placeholder="Décrivez brièvement votre projet..."
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full bg-white/5 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-500 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={status === 'booking'}
                                className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-purple-500 text-white font-black text-lg rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'booking' ? 'Réservation en cours...' : 'Confirmer le rendez-vous'}
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <Clock size={48} className="text-gray-600 mb-4" />
                            <p className="text-gray-500">Sélectionnez un créneau dans le calendrier pour continuer</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;
