import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, Button, Input, GlassSelect, SearchableInput, cn } from './ui';
import { RoadProgressBar } from './RoadProgressBar';
import {
  User, MapPin, Briefcase, Truck, Send, CheckCircle2, ChevronRight,
  Check, Calendar, ShieldCheck, Plus, X, Loader2, AlertCircle, Clock, Sun,
  GraduationCap, Laptop, BookOpen, Building2, Store, Car, Package, Home, Heart, Sparkles,
  Dumbbell, Activity, Coffee, DollarSign, UserPlus
} from 'lucide-react';
import { submitResponse } from '../lib/submitResponse';
import { DualTimeSlider, GLOBAL_MAX } from './DualTimeSlider';
import type { ActivityRow } from '../lib/types';

const STEPS = [
  'User Registration',
  'Profession & Profile',
  'Daily Routine (Weekday)',
  'Weekend & General Places',
  'Vehicle Use Per Month',
  'Upcoming Events',
  'Citizen Comments & Suggestions',
  'Review & Submit'
];

const PLACE_TYPES = [
  'Work / Office', 'School', 'College / University', 'Coaching Centre',
  'Shopping Mall', 'Grocery / Kirana', 'Gym / Fitness Centre',
  'Hospital / Clinic', 'Pharmacy', 'Restaurant / Café',
  'Bank / ATM', 'Religious Place', 'Park / Garden',
  'Cinema / Theatre', 'Sports Complex', 'Government Office',
  'Metro Station', 'Bus Terminal / Stop', 'Airport',
  "Friend's Home / Social Visit", 'Other',
];

const TRANSPORT_OPTIONS = [
  'Own Car', 'Two-Wheeler (Bike/Scooter)', 'BMTC Bus', 'Namma Metro',
  'Auto', 'Cab (Ola/Uber)', 'Cycle', 'Walk', 'Company/School Bus', 'Other',
];

const BANGALORE_PLACES = [
  'Whitefield', 'Hosur', 'Marathahalli', 'Koramangala', 'Jayanagar', 'JP Nagar',
  'Electronic City', 'Hebbal', 'Yelahanka', 'Indiranagar', 'Rajajinagar',
  'Malleshwaram', 'BTM Layout', 'HSR Layout', 'Sarjapur Road', 'Bellandur',
  'MG Road', 'Banashankari', 'Bommanahalli', 'Bannerghatta Road', 'Outer Ring Road',
  'Silk Board', 'Madivala', 'Bommasandra', 'KR Puram', 'Banaswadi',
  'CV Raman Nagar', 'Domlur', 'Frazer Town', 'Shivajinagar', 'Yeshwanthpur',
  'Peenya', 'Kengeri', 'Uttarahalli', 'Gottigere', 'Hulimavu',
  'Anjanapura', 'Vijayanagar', 'Nagarbhavi', 'Rajarajeshwari Nagar', 'Mysore Road',
  'Kanakapura Road', 'Devanahalli', 'Hoskote', 'Anekal', 'Attibele',
  'Chandapura', 'Sarjapura', 'Varthur', 'Hoodi', 'Mahadevapura',
  'Ramamurthy Nagar', 'Kalyan Nagar', 'Horamavu', 'Kothanur', 'Nagavara',
  'Sanjaynagar', 'Dasarahalli', 'Sadashivanagar', 'RT Nagar', 'Hebbal Kempapura',
  'ITPL', 'Kadugodi', 'Panathur', 'Hennur', 'Thanisandra',
  'Jakkur', 'Jalahalli', 'Vidhana Soudha', 'Lal Bagh', 'Cubbon Park',
  'Cunningham Road', 'Commercial Street', 'Brigade Road', 'Ulsoor', 'Cox Town',
  'Kammanahalli', 'HBR Layout', 'Majestic', 'Tumkur Road', 'Hosur Road',
  'KIA Airport', 'Kempapura', 'Sahakara Nagar', 'Lingarajapuram', 'Bagalgunte',
];

function formatTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ampm = h < 12 ? 'AM' : 'PM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

const PROFESSION_CARDS = [
  { id: 'Student', label: 'Student', desc: 'School / College / University', icon: GraduationCap, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { id: 'IT Employee / Manager', label: 'IT Employee / Manager', desc: 'Tech Parks & Offices', icon: Laptop, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  { id: 'Teacher', label: 'Teacher / Professor', desc: 'Education & Lecturing', icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { id: 'Office Employee', label: 'Office Employee', desc: 'Corporate / Admin Roles', icon: Building2, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'Business Owner', label: 'Business Owner', desc: 'Shops & Enterprises', icon: Store, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  { id: 'Driver', label: 'Driver / Cab Operator', desc: 'Logistics & Taxi Services', icon: Car, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { id: 'Delivery Partner', label: 'Delivery Partner', desc: 'Last Mile Delivery', icon: Package, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  { id: 'Homemaker', label: 'Homemaker', desc: 'Household Management', icon: Home, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  { id: 'Retired', label: 'Retired', desc: 'Senior Citizen / Leisure', icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  { id: 'Other', label: 'Other', desc: 'Freelancer / Custom Profile', icon: Sparkles, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/20' },
];

const WEEKDAY_PLACE_OPTIONS = [
  { id: 'Work / Office', label: 'Work / Office', icon: Laptop, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  { id: 'College / University', label: 'College / University', icon: GraduationCap, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { id: 'School', label: 'School', icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { id: 'Coaching Centre', label: 'Coaching Centre', icon: Sparkles, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/20' },
  { id: 'Grocery / Kirana', label: 'Grocery / Kirana Store', icon: Store, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'Gym / Fitness Centre', label: 'Gym / Fitness Centre', icon: Dumbbell, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { id: 'Religious Place', label: 'Temple / Place of Worship', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { id: 'Park / Garden', label: 'Park / Garden', icon: MapPin, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { id: 'Restaurant / Café', label: 'Restaurant / Café', icon: Coffee, color: 'text-amber-200', bg: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'Other', label: 'Other / Custom Location', icon: Sparkles, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10 border-fuchsia-500/20' },
];

const GENERAL_PLACE_IDS = [
  { id: 'Gym / Fitness Centre', label: 'Gym / Fitness Centre', icon: Dumbbell, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { id: 'Temple / Place of Worship', label: 'Temple / Place of Worship', icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  { id: 'Badminton Academy / Sports Club', label: 'Badminton / Sports Club', icon: Activity, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  { id: 'Park / Garden', label: 'Park / Garden', icon: MapPin, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
  { id: 'Supermarket / Kirana Store', label: 'Supermarket / Kirana Store', icon: Store, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'Restaurant / Café', label: 'Restaurant / Café', icon: Coffee, color: 'text-amber-200', bg: 'bg-amber-500/10 border-amber-500/20' },
  { id: 'Bank / ATM', label: 'Bank / ATM', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { id: "Friend's / Relative's Home", label: "Friend's / Relative's Home", icon: Home, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
];

interface QuestionnaireProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ currentStep, setCurrentStep }) => {
  const [formData, setFormData] = useState<any>({
    referrer: '',
    city: 'Bengaluru',
    locality: '',
    designations: [] as string[],
    weekdayPlaces: [] as string[],
    weekdayPlacesDetails: {} as Record<string, { fromPlace: string; toPlace: string; frequency: string; arrivalTime: number; departureTime: number }>,
    generalPlaces: [] as string[],
    generalPlacesDetails: {} as Record<string, { fromPlace: string; toPlace: string; arrivalTime: number; departureTime: number }>,
    vehicles: {
      Car: 0, Bike: 0, Bus: 0, Metro: 0, Cycle: 0, Walk: 0, 'Auto/Cab': 0, Other: 0
    },
    weekdayActivities: [] as ActivityRow[],
    weekendActivities: [] as ActivityRow[],
    places: [] as string[],
    otherPlaces: [] as string[],
    frequency: {} as Record<string, string>,
    events: [] as string[],
    comments: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [undertakingAccepted, setUndertakingAccepted] = useState(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);



  const isWeekdayPlaceComplete = (id: string) => {
    const detail = formData.weekdayPlacesDetails[id];
    return !!(detail && detail.fromPlace && detail.toPlace && detail.frequency && detail.fromPlace.trim() !== '' && detail.toPlace.trim() !== '');
  };

  const isGeneralPlaceComplete = (id: string) => {
    const detail = formData.generalPlacesDetails[id];
    return !!(detail && detail.fromPlace && detail.toPlace && detail.fromPlace.trim() !== '' && detail.toPlace.trim() !== '');
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.locality.trim() !== '';
      case 2:
        return formData.designations && formData.designations.length >= 1;
      case 3:
        return formData.weekdayPlaces.length >= 1 &&
          formData.weekdayPlaces.every(isWeekdayPlaceComplete);
      case 4:
        return formData.generalPlaces.length >= 1 &&
          formData.generalPlaces.every(isGeneralPlaceComplete);
      case 5:
        return true; // Vehicles are always valid
      case 6:
        return formData.events.length >= 1;
      case 7:
        return true; // Comments optional
      case 8:
        return true; // Review step
      default:
        return true;
    }
  };

  const handleLocalityChange = (val: string) => {
    const updatedWeekdayDetails = { ...formData.weekdayPlacesDetails };
    // The first place in weekdayPlaces should have its fromPlace set/defaulted to the new home locality
    const orderedWeekday = WEEKDAY_PLACE_OPTIONS.map(opt => opt.id).filter(id => formData.weekdayPlaces.includes(id));
    orderedWeekday.forEach((p, idx) => {
      if (idx === 0) {
        if (!updatedWeekdayDetails[p]) {
          updatedWeekdayDetails[p] = { fromPlace: val, toPlace: '', frequency: 'Daily (20-30 days)', arrivalTime: 540, departureTime: 1020 };
        } else {
          updatedWeekdayDetails[p].fromPlace = val;
        }
      }
    });

    const updatedGeneralDetails = { ...formData.generalPlacesDetails };
    const orderedGeneral = GENERAL_PLACE_IDS.map(opt => opt.id).filter(id => formData.generalPlaces.includes(id));
    orderedGeneral.forEach((gp, idx) => {
      if (idx === 0) {
        if (!updatedGeneralDetails[gp]) {
          updatedGeneralDetails[gp] = { fromPlace: val, toPlace: '', arrivalTime: 480, departureTime: 540 };
        } else {
          updatedGeneralDetails[gp].fromPlace = val;
        }
      }
    });

    setFormData({
      ...formData,
      locality: val,
      weekdayPlacesDetails: updatedWeekdayDetails,
      generalPlacesDetails: updatedGeneralDetails
    });
  };

  const getWeekdayPlaceDefaultDuration = (p: string): number => {
    if (p === 'College / University' || p === 'School') return 450;
    if (p === 'Work / Office') return 480;
    if (p === 'Coaching Centre') return 120;
    if (p === 'Grocery / Kirana') return 60;
    if (p === 'Gym / Fitness Centre') return 60;
    if (p === 'Religious Place') return 30;
    if (p === 'Park / Garden') return 60;
    if (p === 'Restaurant / Café') return 60;
    return 60;
  };

  const getGeneralPlaceDefaultDuration = (p: string): number => {
    if (p === 'Gym / Fitness Centre') return 90;
    if (p === 'Temple / Place of Worship') return 60;
    if (p === 'Badminton Academy / Sports Club') return 120;
    if (p === 'Park / Garden') return 60;
    if (p === 'Supermarket / Kirana Store') return 60;
    if (p === 'Restaurant / Café') return 60;
    if (p === 'Bank / ATM') return 30;
    if (p === "Friend's / Relative's Home") return 120;
    return 60;
  };

  const syncWeekdayPlaces = (updatedDesignations: string[]) => {
    const mapping: Record<string, string> = {
      'Student': 'College / University',
      'Teacher': 'School',
      'IT Employee / Manager': 'Work / Office',
      'Office Employee': 'Work / Office',
      'Business Owner': 'Work / Office',
      'Driver': 'Work / Office',
      'Delivery Partner': 'Work / Office',
    };

    // Find all places that should be checked based on the active designations
    const activeMappedPlaces = new Set<string>();
    updatedDesignations.forEach((desig: string) => {
      const targetPlace = mapping[desig];
      if (targetPlace) {
        activeMappedPlaces.add(targetPlace);
      }
    });

    // Mapped places set (places that are controlled by Step 2 designations)
    const allMappedPlaces = new Set(Object.values(mapping));

    // Filter the current weekdayPlaces:
    // - Keep any place that is NOT controlled by designations (manual places like Gym, Grocery, etc.)
    // - For places controlled by designations, only keep them if they are in activeMappedPlaces
    const currentPlaces = formData.weekdayPlaces || [];
    const preservedManualPlaces = currentPlaces.filter((p: string) => !allMappedPlaces.has(p));

    // Combine preserved manual places with the active mapped ones
    const updatedPlacesSet = new Set([...preservedManualPlaces, ...Array.from(activeMappedPlaces)]);
    const updatedPlaces = Array.from(updatedPlacesSet);

    const updatedDetails = { ...formData.weekdayPlacesDetails };

    // Clean up details for places that are no longer selected
    Object.keys(updatedDetails).forEach((p) => {
      if (!updatedPlaces.includes(p)) {
        delete updatedDetails[p];
      }
    });

    // Add default details for newly added places
    const orderedWeekday = WEEKDAY_PLACE_OPTIONS.map(opt => opt.id).filter(id => updatedPlaces.includes(id));
    updatedPlaces.forEach((p: string) => {
      if (!updatedDetails[p]) {
        const duration = getWeekdayPlaceDefaultDuration(p);
        const currentIdx = orderedWeekday.indexOf(p);

        let arrivalTime = 540;
        if (currentIdx > 0) {
          const prevPlace = orderedWeekday[currentIdx - 1];
          if (updatedDetails[prevPlace]) {
            arrivalTime = updatedDetails[prevPlace].departureTime;
          }
        } else {
          if (p === 'College / University' || p === 'School') arrivalTime = 510;
          else if (p === 'Coaching Centre') arrivalTime = 1020;
          else if (p === 'Grocery / Kirana') arrivalTime = 660;
          else if (p === 'Gym / Fitness Centre') arrivalTime = 360;
          else if (p === 'Religious Place') arrivalTime = 480;
          else if (p === 'Park / Garden') arrivalTime = 1020;
          else if (p === 'Restaurant / Café') arrivalTime = 780;
        }
        const departureTime = Math.min(arrivalTime + duration, GLOBAL_MAX);

        updatedDetails[p] = {
          fromPlace: '',
          toPlace: '',
          frequency: 'Daily (20-30 days)',
          arrivalTime,
          departureTime
        };
      }
    });

    // Auto-propagate locations sequence
    orderedWeekday.forEach((p, idx) => {
      if (idx === 0) {
        if (!updatedDetails[p].fromPlace) {
          updatedDetails[p].fromPlace = formData.locality || '';
        }
      } else {
        const prevPlace = orderedWeekday[idx - 1];
        const prevTo = updatedDetails[prevPlace]?.toPlace || '';
        if (prevTo && !updatedDetails[p].fromPlace) {
          updatedDetails[p].fromPlace = prevTo;
        }
      }
    });

    return { updatedPlaces, updatedDetails };
  };

  const toggleProfession = (id: string) => {
    const current = [...formData.designations];
    let updated = [];
    if (current.includes(id)) {
      updated = current.filter(d => d !== id);
    } else {
      updated = [...current, id];
    }

    const { updatedPlaces, updatedDetails } = syncWeekdayPlaces(updated);

    setFormData({
      ...formData,
      designations: updated,
      weekdayPlaces: updatedPlaces,
      weekdayPlacesDetails: updatedDetails
    });
  };

  const compileFinalData = () => {
    const finalDesignation = formData.designations.join(', ');
    const finalWeekdayActivities: ActivityRow[] = [];

    formData.weekdayPlaces.forEach((placeType: string) => {
      const detail = formData.weekdayPlacesDetails[placeType];
      if (detail) {
        finalWeekdayActivities.push({
          placeType,
          transport: 'Two-Wheeler', // Default transport, asked separately in Step 5
          place: `${detail.fromPlace || ''} -> ${detail.toPlace || ''}`,
          arrivalMin: detail.arrivalTime || 540,
          departureMin: detail.departureTime || 1020,
        });
      }
    });

    if (finalWeekdayActivities.length === 0) {
      finalWeekdayActivities.push({
        placeType: 'Other',
        transport: 'Walk',
        place: `${formData.locality || 'Bengaluru'} -> ${formData.locality || 'Bengaluru'}`,
        arrivalMin: 540,
        departureMin: 600,
      });
    }

    const finalWeekendActivities: ActivityRow[] = [];
    formData.generalPlaces.forEach((placeName: string) => {
      const detail = formData.generalPlacesDetails[placeName];
      if (detail) {
        let placeType = 'Other';
        if (placeName === 'Gym / Fitness Centre') placeType = 'Gym / Fitness Centre';
        else if (placeName === 'Temple / Place of Worship') placeType = 'Religious Place';
        else if (placeName === 'Badminton Academy / Sports Club') placeType = 'Sports Complex';
        else if (placeName === 'Park / Garden') placeType = 'Park / Garden';
        else if (placeName === 'Supermarket / Kirana Store') placeType = 'Grocery / Kirana';
        else if (placeName === 'Restaurant / Café') placeType = 'Restaurant / Café';
        else if (placeName === 'Bank / ATM') placeType = 'Bank / ATM';
        else if (placeName === "Friend's / Relative's Home") placeType = "Friend's Home / Social Visit";

        finalWeekendActivities.push({
          placeType,
          transport: 'Two-Wheeler', // Default transport, asked separately in Step 5
          place: `${detail.fromPlace || ''} -> ${detail.toPlace || ''}`,
          arrivalMin: detail.arrivalTime || 480,
          departureMin: detail.departureTime || 540,
        });
      }
    });

    if (finalWeekendActivities.length === 0) {
      finalWeekendActivities.push({
        placeType: 'Other',
        transport: 'Walk',
        place: `${formData.locality || 'Bengaluru'} -> ${formData.locality || 'Bengaluru'}`,
        arrivalMin: 600,
        departureMin: 660,
      });
    }

    const allUniquePlaces = new Set<string>();
    if (formData.locality.trim()) {
      allUniquePlaces.add(formData.locality.trim());
    }

    formData.weekdayPlaces.forEach((p: string) => {
      const detail = formData.weekdayPlacesDetails[p];
      if (detail) {
        if (detail.fromPlace && detail.fromPlace.trim()) allUniquePlaces.add(detail.fromPlace.trim());
        if (detail.toPlace && detail.toPlace.trim()) allUniquePlaces.add(detail.toPlace.trim());
      }
    });

    formData.generalPlaces.forEach((placeName: string) => {
      const detail = formData.generalPlacesDetails[placeName];
      if (detail) {
        if (detail.fromPlace && detail.fromPlace.trim()) allUniquePlaces.add(detail.fromPlace.trim());
        if (detail.toPlace && detail.toPlace.trim()) allUniquePlaces.add(detail.toPlace.trim());
      }
    });

    const placesArray = Array.from(allUniquePlaces);
    const standardPlacesList = ['Whitefield', 'Marathahalli', 'Koramangala', 'Jayanagar', 'JP Nagar', 'Electronic City', 'Hebbal', 'Yelahanka', 'Indiranagar', 'Rajajinagar', 'Malleshwaram', 'BTM Layout', 'HSR Layout', 'Sarjapur Road', 'Bellandur', 'MG Road', 'Airport'];

    const finalPlaces = placesArray.filter(p => standardPlacesList.includes(p));
    const finalOtherPlaces = placesArray.filter(p => !standardPlacesList.includes(p));

    const finalFrequency: Record<string, string> = {};
    formData.weekdayPlaces.forEach((p: string) => {
      const detail = formData.weekdayPlacesDetails[p];
      if (detail) {
        if (detail.fromPlace && detail.fromPlace.trim()) {
          finalFrequency[detail.fromPlace.trim()] = detail.frequency;
        }
        if (detail.toPlace && detail.toPlace.trim()) {
          finalFrequency[detail.toPlace.trim()] = detail.frequency;
        }
      }
    });

    formData.generalPlaces.forEach((placeName: string) => {
      const detail = formData.generalPlacesDetails[placeName];
      if (detail) {
        if (detail.fromPlace && detail.fromPlace.trim()) {
          finalFrequency[detail.fromPlace.trim()] = 'Weekly (15-20 days)';
        }
        if (detail.toPlace && detail.toPlace.trim()) {
          finalFrequency[detail.toPlace.trim()] = 'Weekly (15-20 days)';
        }
      }
    });

    if (formData.locality.trim()) {
      finalFrequency[formData.locality.trim()] = 'Daily (20-30 days)';
    }

    return {
      ...formData,
      designation: finalDesignation,
      weekdayActivities: finalWeekdayActivities,
      weekendActivities: finalWeekendActivities,
      places: finalPlaces,
      otherPlaces: finalOtherPlaces,
      frequency: finalFrequency,
    };
  };

  const nextStep = () => {
    if (isStepValid(currentStep) && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid(8)) return;
    setIsSubmitting(true);
    setSubmitError(null);
    const compiledData = compileFinalData();
    const result = await submitResponse(compiledData);
    setIsSubmitting(false);
    if (result.success) {
      setUserId(result.userId ?? 'VAA-USER-????');
      setIsSubmitted(true);
    } else {
      setSubmitError(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GlassCard key="step1" className="max-w-xl w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 md:mb-12 text-center md:text-left">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-xl">
                <User size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-poppins font-black text-white tracking-tighter uppercase">User Registration</h2>
                <p className="text-white/50 font-medium text-xs md:text-sm mt-1">Initialize your urban node profile.</p>
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase ml-1">1. CITY</label>
                  <Input
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    disabled
                    className="opacity-50 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase ml-1">2. LOCALITY / AREA <span className="text-red-400">*</span></label>
                  <SearchableInput
                    placeholder="e.g. Whitefield"
                    options={BANGALORE_PLACES}
                    value={formData.locality}
                    onChange={handleLocalityChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase ml-1 flex items-center gap-1.5">
                  <UserPlus size={12} className="text-white/30" />
                  3. REFERRER <span className="lowercase opacity-60">(Optional)</span>
                </label>
                <Input
                  placeholder="Name of the Referrer"
                  value={formData.referrer}
                  onChange={(e) => setFormData({ ...formData, referrer: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-10 md:mt-14 flex justify-end">
              <Button onClick={nextStep} className="w-full md:w-auto" disabled={!isStepValid(1)}>
                Next <ChevronRight size={18} />
              </Button>
            </div>
          </GlassCard>
        );

      case 2:
        return (
          <GlassCard key="step2" className="max-w-2xl w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 md:mb-12 text-center md:text-left">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-xl">
                <Briefcase size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-poppins font-black text-white tracking-tighter uppercase">Profession & Profile</h2>
                <p className="text-white/50 font-medium text-xs md:text-sm mt-1">Select all roles/profiles that apply to you.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PROFESSION_CARDS.map((card) => {
                const isSelected = formData.designations.includes(card.id);
                const IconComponent = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => toggleProfession(card.id)}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden",
                      isSelected
                        ? "bg-white border-white text-slate-900 shadow-xl scale-[1.02]"
                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center border shadow-md transition-colors",
                      isSelected ? "bg-slate-900 border-slate-900 text-white" : `${card.bg} ${card.color}`
                    )}>
                      <IconComponent size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-poppins font-bold text-xs tracking-wider uppercase truncate", isSelected ? "text-slate-900" : "text-white")}>
                        {card.label}
                      </p>
                      <p className={cn("text-[10px] font-medium mt-0.5 truncate", isSelected ? "text-slate-500" : "text-white/30")}>
                        {card.desc}
                      </p>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0",
                      isSelected ? "bg-slate-900 border-slate-900 text-white" : "border-white/20 group-hover:border-white/40"
                    )}>
                      {isSelected && <Check size={12} strokeWidth={4} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 md:mt-14 flex flex-col md:flex-row justify-between gap-4">
              <Button variant="outline" onClick={prevStep} className="order-2 md:order-1">Back</Button>
              <Button onClick={nextStep} className="order-1 md:order-2" disabled={!isStepValid(2)}>
                Next <ChevronRight size={18} />
              </Button>
            </div>
          </GlassCard>
        );

      case 3:
        const toggleWeekdayPlace = (id: string) => {
          const current = [...formData.weekdayPlaces];
          let updated = [];
          if (current.includes(id)) {
            updated = current.filter(p => p !== id);
          } else {
            updated = [...current, id];
          }

          const updatedDetails = { ...formData.weekdayPlacesDetails };
          if (current.includes(id)) {
            delete updatedDetails[id];
          }

          // Order updated list first so we know sequence for timing and location defaulting
          const ordered = WEEKDAY_PLACE_OPTIONS.map(opt => opt.id).filter(p => updated.includes(p));

          updated.forEach((p: string) => {
            if (!updatedDetails[p]) {
              const duration = getWeekdayPlaceDefaultDuration(p);
              const currentIdx = ordered.indexOf(p);

              let arrivalTime = 540;
              if (currentIdx > 0) {
                const prevPlace = ordered[currentIdx - 1];
                if (updatedDetails[prevPlace]) {
                  arrivalTime = updatedDetails[prevPlace].departureTime;
                }
              } else {
                if (p === 'College / University' || p === 'School') arrivalTime = 510;
                else if (p === 'Coaching Centre') arrivalTime = 1020;
                else if (p === 'Grocery / Kirana') arrivalTime = 660;
                else if (p === 'Gym / Fitness Centre') arrivalTime = 360;
                else if (p === 'Religious Place') arrivalTime = 480;
                else if (p === 'Park / Garden') arrivalTime = 1020;
                else if (p === 'Restaurant / Café') arrivalTime = 780;
              }
              const departureTime = Math.min(arrivalTime + duration, GLOBAL_MAX);

              updatedDetails[p] = {
                fromPlace: '',
                toPlace: '',
                frequency: 'Daily (20-30 days)',
                arrivalTime,
                departureTime,
              };
            }
          });

          // Propagation of from/to sequence
          ordered.forEach((p, idx) => {
            if (idx === 0) {
              if (!updatedDetails[p].fromPlace) {
                updatedDetails[p].fromPlace = formData.locality || '';
              }
            } else {
              const prevPlace = ordered[idx - 1];
              const prevTo = updatedDetails[prevPlace]?.toPlace || '';
              if (prevTo && !updatedDetails[p].fromPlace) {
                updatedDetails[p].fromPlace = prevTo;
              }
            }
          });

          setFormData({ ...formData, weekdayPlaces: updated, weekdayPlacesDetails: updatedDetails });
        };

        const updateWeekdayPlaceDetail = (id: string, field: string, val: any) => {
          const updatedDetails = { ...formData.weekdayPlacesDetails };
          updatedDetails[id] = { ...updatedDetails[id], [field]: val };

          // Auto-propagate toPlaces to subsequent fromPlaces
          const ordered = WEEKDAY_PLACE_OPTIONS.map(opt => opt.id).filter(p => formData.weekdayPlaces.includes(p));
          ordered.forEach((p, idx) => {
            if (idx > 0) {
              const prevPlace = ordered[idx - 1];
              const prevTo = updatedDetails[prevPlace]?.toPlace || '';
              if (p === id && field === 'fromPlace') {
                // manual edit
              } else if (prevPlace === id && field === 'toPlace') {
                if (updatedDetails[p]) {
                  updatedDetails[p].fromPlace = val;
                }
              } else if (!updatedDetails[p].fromPlace) {
                updatedDetails[p].fromPlace = prevTo;
              }
            } else if (idx === 0 && !updatedDetails[p].fromPlace) {
              updatedDetails[p].fromPlace = formData.locality || '';
            }
          });

          setFormData({ ...formData, weekdayPlacesDetails: updatedDetails });
        };

        const updateWeekdayPlaceTiming = (id: string, arrivalTime: number, departureTime: number) => {
          const updatedDetails = { ...formData.weekdayPlacesDetails };
          updatedDetails[id] = { ...updatedDetails[id], arrivalTime, departureTime };
          setFormData({ ...formData, weekdayPlacesDetails: updatedDetails });
        };

        return (
          <GlassCard key="step3" className="max-w-2xl w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 md:mb-12 text-center md:text-left">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-xl">
                <Clock size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-poppins font-black text-white tracking-tighter uppercase">Daily Routine (Weekday)</h2>
                <p className="text-white/50 font-medium text-xs md:text-sm mt-1">Select places you visit on weekdays and specify route details.</p>
              </div>
            </div>

            <div className="space-y-4">
              {WEEKDAY_PLACE_OPTIONS.map((item) => {
                const isSelected = formData.weekdayPlaces.includes(item.id);
                const IconComponent = item.icon;
                const detail = formData.weekdayPlacesDetails[item.id] || { fromPlace: '', toPlace: '', frequency: 'Daily (20-30 days)', arrivalTime: 540, departureTime: 1020 };
                const complete = isWeekdayPlaceComplete(item.id);

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-3xl border transition-all duration-300",
                      isSelected
                        ? "bg-white/[0.04] border-white/15 shadow-lg"
                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                    )}
                  >
                    <button
                      onClick={() => toggleWeekdayPlace(item.id)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm",
                          isSelected ? "bg-white text-slate-900 border-white" : `${item.bg} ${item.color}`
                        )}>
                          <IconComponent size={18} />
                        </div>
                        <span className="font-poppins font-bold text-xs tracking-wider uppercase text-white">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {isSelected && (
                          complete ? (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                              <Check size={10} strokeWidth={4} /> Complete
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md animate-pulse">
                              <AlertCircle size={10} strokeWidth={3} /> Info Required
                            </span>
                          )
                        )}
                        <div className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                          isSelected ? "bg-blue-500 border-blue-500 text-white" : "border-white/20"
                        )}>
                          {isSelected && <Check size={12} strokeWidth={4} />}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="border-t border-white/10 bg-black/20 rounded-b-3xl p-5 space-y-4"
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SearchableInput
                              label="From Location"
                              options={BANGALORE_PLACES}
                              value={detail.fromPlace || ''}
                              onChange={(val) => updateWeekdayPlaceDetail(item.id, 'fromPlace', val)}
                              placeholder="Starting point"
                            />

                            <SearchableInput
                              label="To Location"
                              options={BANGALORE_PLACES}
                              value={detail.toPlace || ''}
                              onChange={(val) => updateWeekdayPlaceDetail(item.id, 'toPlace', val)}
                              placeholder="Destination point"
                            />

                            <GlassSelect
                              label="Frequency"
                              options={[
                                'Daily (20-30 days)',
                                'Weekly (15-20 days)',
                                'Monthly (7-10 days)',
                                'Rarely (0-5 days)'
                              ]}
                              value={detail.frequency}
                              onChange={(val) => updateWeekdayPlaceDetail(item.id, 'frequency', val)}
                              placeholder="Select frequency"
                            />
                          </div>

                          <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-end mb-1">
                              <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Timing spent there ({formatTime(detail.arrivalTime)} - {formatTime(detail.departureTime)})</label>
                            </div>
                            <DualTimeSlider
                              globalMin={240}
                              arrivalMin={detail.arrivalTime}
                              departureMin={detail.departureTime}
                              onChange={(arrival, departure) => updateWeekdayPlaceTiming(item.id, arrival, departure)}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 md:mt-14 flex flex-col md:flex-row justify-between gap-4">
              <Button variant="outline" onClick={prevStep} className="order-2 md:order-1">Back</Button>
              <Button onClick={nextStep} className="order-1 md:order-2" disabled={!isStepValid(3)}>
                Next <ChevronRight size={18} />
              </Button>
            </div>
          </GlassCard>
        );

      case 4:
        const toggleGeneralPlace = (id: string) => {
          const current = [...formData.generalPlaces];
          let updated = [];
          if (current.includes(id)) {
            updated = current.filter(p => p !== id);
          } else {
            updated = [...current, id];
          }

          const updatedDetails = { ...formData.generalPlacesDetails };
          if (current.includes(id)) {
            delete updatedDetails[id];
          }

          // Order updated list first so we know sequence for timing and location defaulting
          const ordered = GENERAL_PLACE_IDS.map(opt => opt.id).filter(p => updated.includes(p));

          updated.forEach((p: string) => {
            if (!updatedDetails[p]) {
              const duration = getGeneralPlaceDefaultDuration(p);
              const currentIdx = ordered.indexOf(p);

              let arrivalTime = 480;
              if (currentIdx > 0) {
                const prevPlace = ordered[currentIdx - 1];
                if (updatedDetails[prevPlace]) {
                  arrivalTime = updatedDetails[prevPlace].departureTime;
                }
              } else {
                if (p === 'Gym / Fitness Centre') arrivalTime = 480;
                else if (p === 'Temple / Place of Worship') arrivalTime = 540;
                else if (p === 'Badminton Academy / Sports Club') arrivalTime = 600;
                else if (p === 'Park / Garden') arrivalTime = 960;
                else if (p === 'Supermarket / Kirana Store') arrivalTime = 660;
                else if (p === 'Restaurant / Café') arrivalTime = 780;
                else if (p === 'Bank / ATM') arrivalTime = 900;
                else if (p === "Friend's / Relative's Home") arrivalTime = 1080;
              }
              const departureTime = Math.min(arrivalTime + duration, GLOBAL_MAX);

              updatedDetails[p] = {
                fromPlace: '',
                toPlace: '',
                arrivalTime,
                departureTime,
              };
            }
          });

          // Sync From/To locations in updatedDetails
          ordered.forEach((p, idx) => {
            if (!updatedDetails[p]) return;
            if (idx === 0) {
              if (!updatedDetails[p].fromPlace) {
                updatedDetails[p].fromPlace = formData.locality || '';
              }
            } else {
              const prevPlace = ordered[idx - 1];
              const prevTo = updatedDetails[prevPlace]?.toPlace || '';
              if (prevTo && !updatedDetails[p].fromPlace) {
                updatedDetails[p].fromPlace = prevTo;
              }
            }
          });

          setFormData({ ...formData, generalPlaces: updated, generalPlacesDetails: updatedDetails });
        };

        const updatePlaceDetail = (id: string, field: string, val: any) => {
          const updatedDetails = { ...formData.generalPlacesDetails };
          updatedDetails[id] = { ...updatedDetails[id], [field]: val };

          // Auto-propagate toPlaces to subsequent fromPlaces
          const ordered = GENERAL_PLACE_IDS.map(opt => opt.id).filter(p => formData.generalPlaces.includes(p));
          ordered.forEach((p, idx) => {
            if (idx > 0) {
              const prevPlace = ordered[idx - 1];
              const prevTo = updatedDetails[prevPlace]?.toPlace || '';
              if (p === id && field === 'fromPlace') {
                // manual edit
              } else if (prevPlace === id && field === 'toPlace') {
                if (updatedDetails[p]) {
                  updatedDetails[p].fromPlace = val;
                }
              } else if (!updatedDetails[p].fromPlace) {
                updatedDetails[p].fromPlace = prevTo;
              }
            } else if (idx === 0 && !updatedDetails[p].fromPlace) {
              updatedDetails[p].fromPlace = formData.locality || '';
            }
          });

          setFormData({ ...formData, generalPlacesDetails: updatedDetails });
        };

        const updateGeneralPlaceTiming = (id: string, arrivalTime: number, departureTime: number) => {
          const updatedDetails = { ...formData.generalPlacesDetails };
          updatedDetails[id] = { ...updatedDetails[id], arrivalTime, departureTime };
          setFormData({ ...formData, generalPlacesDetails: updatedDetails });
        };

        return (
          <GlassCard key="step4" className="max-w-2xl w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 md:mb-12 text-center md:text-left">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 border border-violet-500/30 shadow-xl">
                <Sun size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-poppins font-black text-white tracking-tighter uppercase">Weekend & General Places</h2>
                <p className="text-white/50 font-medium text-xs md:text-sm mt-1">Select places you visit regularly on weekends or occasionally.</p>
              </div>
            </div>

            <div className="space-y-4">
              {GENERAL_PLACE_IDS.map((item) => {
                const isSelected = formData.generalPlaces.includes(item.id);
                const IconComponent = item.icon;
                const detail = formData.generalPlacesDetails[item.id] || { fromPlace: '', toPlace: '', arrivalTime: 480, departureTime: 540 };
                const complete = isGeneralPlaceComplete(item.id);

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-3xl border transition-all duration-300",
                      isSelected
                        ? "bg-white/[0.04] border-white/15 shadow-lg"
                        : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                    )}
                  >
                    <button
                      onClick={() => toggleGeneralPlace(item.id)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm",
                          isSelected ? "bg-white text-slate-900 border-white" : `${item.bg} ${item.color}`
                        )}>
                          <IconComponent size={18} />
                        </div>
                        <span className="font-poppins font-bold text-xs tracking-wider uppercase text-white">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {isSelected && (
                          complete ? (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                              <Check size={10} strokeWidth={4} /> Done
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md animate-pulse">
                              <AlertCircle size={10} strokeWidth={3} /> Info Required
                            </span>
                          )
                        )}
                        <div className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                          isSelected ? "bg-violet-500 border-violet-500 text-white" : "border-white/20"
                        )}>
                          {isSelected && <Check size={12} strokeWidth={4} />}
                        </div>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="border-t border-white/10 bg-black/20 rounded-b-3xl p-5 space-y-4"
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SearchableInput
                              label="From Location"
                              options={BANGALORE_PLACES}
                              value={detail.fromPlace || ''}
                              onChange={(val) => updatePlaceDetail(item.id, 'fromPlace', val)}
                              placeholder="Starting point"
                            />

                            <SearchableInput
                              label="To Location"
                              options={BANGALORE_PLACES}
                              value={detail.toPlace || ''}
                              onChange={(val) => updatePlaceDetail(item.id, 'toPlace', val)}
                              placeholder="Destination point"
                            />
                          </div>

                          <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-end mb-1">
                              <label className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Timing spent there ({formatTime(detail.arrivalTime)} - {formatTime(detail.departureTime)})</label>
                            </div>
                            <DualTimeSlider
                              globalMin={240}
                              arrivalMin={detail.arrivalTime}
                              departureMin={detail.departureTime}
                              onChange={(arrival, departure) => updateGeneralPlaceTiming(item.id, arrival, departure)}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 md:mt-14 flex flex-col md:flex-row justify-between gap-4">
              <Button variant="outline" onClick={prevStep} className="order-2 md:order-1">Back</Button>
              <Button onClick={nextStep} className="order-1 md:order-2" disabled={!isStepValid(4)}>
                Next <ChevronRight size={18} />
              </Button>
            </div>
          </GlassCard>
        );

      case 5:
        return (
          <GlassCard key="step5" className="max-w-2xl w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 md:mb-12 text-center md:text-left">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-xl">
                <Truck size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-poppins font-black text-white tracking-tighter uppercase">Vehicle Use Per Month</h2>
                <p className="text-white/50 font-medium text-xs md:text-sm mt-1">Enter approximate number of days used per month.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {['Car', 'Bike', 'Bus', 'Metro', 'Cycle', 'Walk', 'Auto/Cab', 'Other'].map((v) => (
                <div key={v} className="space-y-4">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-bold text-white/40 tracking-widest uppercase">{v} days per month</label>
                    <span className="text-xl font-poppins font-black text-blue-400">{(formData.vehicles as any)[v]}</span>
                  </div>
                  <input
                    type="range" min="0" max="30"
                    value={(formData.vehicles as any)[v]}
                    onChange={(e) => setFormData({ ...formData, vehicles: { ...formData.vehicles, [v]: parseInt(e.target.value) } })}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 md:mt-16 flex flex-col md:flex-row justify-between gap-4">
              <Button variant="outline" onClick={prevStep} className="order-2 md:order-1">Back</Button>
              <Button onClick={nextStep} className="order-1 md:order-2" disabled={!isStepValid(5)}>Next</Button>
            </div>
          </GlassCard>
        );

      case 6:
        const EVENTS = ['Marriage', 'Examination', 'Religious Event', 'Sports Event', 'Conference', 'School Function', 'Other'];
        return (
          <GlassCard key="step6" className="max-w-2xl w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 md:mb-12 text-center md:text-left">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-xl">
                <CheckCircle2 size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-poppins font-black text-white tracking-tighter uppercase">Upcoming Events</h2>
                <p className="text-white/50 font-medium text-xs md:text-sm mt-1">Select at least 1 event likely in the next 30 days.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EVENTS.map(event => (
                <button
                  key={event}
                  onClick={() => {
                    const events = formData.events.includes(event)
                      ? formData.events.filter((e: string) => e !== event)
                      : [...formData.events, event];
                    setFormData({ ...formData, events });
                  }}
                  className={cn(
                    "flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group",
                    formData.events.includes(event) ? "bg-white border-white text-slate-900 shadow-lg" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                  )}
                >
                  <span className="font-poppins font-bold text-xs tracking-widest uppercase">{event}</span>
                  <div className={cn("w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all", formData.events.includes(event) ? "bg-slate-900 border-slate-900" : "border-white/10 group-hover:border-white/30")}>
                    {formData.events.includes(event) && <Check size={16} className="text-white" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 md:mt-16 flex flex-col md:flex-row justify-between gap-4">
              <Button variant="outline" onClick={prevStep} className="order-2 md:order-1">Back</Button>
              <Button onClick={nextStep} className="order-1 md:order-2" disabled={!isStepValid(6)}>Next</Button>
            </div>
          </GlassCard>
        );

      case 7:
        return (
          <GlassCard key="step7" className="max-w-2xl w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 md:mb-12 text-center md:text-left">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-xl">
                <Send size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-poppins font-black text-white tracking-tighter uppercase">Citizen Comments & Suggestions</h2>
                <p className="text-white/50 font-medium text-xs md:text-sm mt-1">What would you like Vaahana planners to know? (Optional)</p>
              </div>
            </div>

            <div className="relative group">
              <textarea
                placeholder="Share traffic observations, route difficulties, parking issues, public transport concerns, or suggestions..."
                className="w-full h-48 md:h-64 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 focus:bg-white/10 focus:border-white/30 outline-none transition-all font-inter text-white shadow-inner resize-none text-base md:text-lg font-medium"
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              />
              <div className="absolute bottom-6 right-8 text-[10px] font-bold text-white/30 tracking-widest uppercase">
                {formData.comments.length} / 500
              </div>
            </div>

            <div className="mt-12 md:mt-16 flex flex-col md:flex-row justify-between gap-4">
              <Button variant="outline" onClick={prevStep} className="order-2 md:order-1">Back</Button>
              <Button onClick={nextStep} className="order-1 md:order-2" disabled={!isStepValid(7)}>Review</Button>
            </div>
          </GlassCard>
        );

      case 8:
        const compiledData = compileFinalData();
        return (
          <GlassCard key="step8" className="max-w-2xl w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-8 md:mb-10 text-center md:text-left">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-xl">
                <ShieldCheck size={28} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-poppins font-black text-white tracking-tighter uppercase">Review & Submit</h2>
                <p className="text-white/50 font-medium text-xs md:text-sm mt-1">Please review your mobility registration before submitting.</p>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">User Profile</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between border-b border-white/5 py-1 col-span-1 sm:col-span-2">
                    <span className="text-white/50">Locality:</span>
                    <span className="font-bold text-white">{compiledData.locality}, {compiledData.city}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 py-1 col-span-1 sm:col-span-2">
                    <span className="text-white/50">Referrer:</span>
                    <span className="font-bold text-white">{compiledData.referrer || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Selected Professions</p>
                <div className="flex flex-wrap gap-2">
                  {formData.designations.map((d: string) => (
                    <span key={d} className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {formData.weekdayPlaces.length > 0 && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Weekday Daily Routine</p>
                  <div className="space-y-2">
                    {formData.weekdayPlaces.map((p: string) => {
                      const det = formData.weekdayPlacesDetails[p];
                      if (!det) return null;
                      return (
                        <div key={p} className="text-xs bg-white/[0.02] border border-white/5 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-white/80 block">{p}</span>
                            <span className="text-white/40">{det.fromPlace || 'Not set'} → {det.toPlace || 'Not set'}</span>
                          </div>
                          <div className="text-right sm:text-right">
                            <span className="font-bold text-blue-400 block">{det.frequency}</span>
                            <span className="text-white/40">({formatTime(det.arrivalTime)} - {formatTime(det.departureTime)})</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {formData.generalPlaces.length > 0 && (
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Weekend & General Places</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {formData.generalPlaces.map((gp: string) => {
                      const det = formData.generalPlacesDetails[gp];
                      if (!det) return null;
                      return (
                        <div key={gp} className="text-xs bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                          <span className="font-bold text-white/80 block">{gp}</span>
                          <span className="text-white/40 block">{det.fromPlace || 'Not set'} → {det.toPlace || 'Not set'}</span>
                          <span className="text-blue-400 font-bold block mt-1">({formatTime(det.arrivalTime)} - {formatTime(det.departureTime)})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Vehicles & Comments</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center">
                    <span className="text-white/40 block">Vehicles Rated</span>
                    <span className="text-lg font-black text-white">
                      {Object.values(formData.vehicles).filter(v => (v as number) > 0).length} active
                    </span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center">
                    <span className="text-white/40 block">Comments Added</span>
                    <span className="text-lg font-black text-white">{formData.comments ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>

            {submitError && (
              <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold mb-0.5">Submission Failed</p>
                  <p className="text-xs font-normal opacity-80">{submitError}</p>
                </div>
              </div>
            )}

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <button
                onClick={() => setUndertakingAccepted(!undertakingAccepted)}
                className="flex items-start gap-4 w-full text-left group"
              >
                <div className={cn(
                  "w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
                  undertakingAccepted
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-white/20 group-hover:border-white/40"
                )}>
                  {undertakingAccepted && <Check size={12} strokeWidth={4} />}
                </div>
                <p className="text-xs text-white/60 leading-relaxed">
                  I hereby declare that the information submitted is anonymous and will be used solely for research and traffic management purposes. I confirm that, to the best of my knowledge, the information provided in this submission is accurate and complete.
                </p>
              </button>
            </div>

            <div className="mt-8 md:mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
              <Button variant="outline" onClick={prevStep} className="w-full md:w-auto order-2 md:order-1" disabled={isSubmitting}>Back</Button>
              <Button
                onClick={handleSubmit}
                variant="primary"
                className="w-full md:flex-1 order-1 md:order-2 flex items-center justify-center gap-2"
                disabled={isSubmitting || !undertakingAccepted}
              >
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Registration'}
              </Button>
            </div>
          </GlassCard>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-xl mx-auto px-4">
        <GlassCard className="text-center relative z-10 border-blue-500/20 shadow-[0_40px_100px_rgba(37,99,235,0.2)]">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-20 h-20 md:w-24 md:h-24 bg-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 md:mb-10 border border-blue-500/30"
          >
            <CheckCircle2 size={40} className="text-blue-400" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-poppins font-black text-white tracking-tighter mb-4 uppercase">Registration Complete</h2>
          <p className="text-white/50 font-medium mb-10 md:mb-12 text-sm md:text-lg leading-relaxed">Your mobility pattern has been registered successfully.</p>

          <div className="p-8 md:p-12 bg-white rounded-[2rem] md:rounded-[3rem] mb-10 md:mb-12 shadow-3xl overflow-hidden relative group">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">VAAHANA USER ID</p>
            <h3 className="text-3xl md:text-5xl font-mono font-black text-slate-900 tracking-[0.2em]">{userId}</h3>
          </div>

          <Button onClick={() => window.location.reload()} variant="outline" className="w-full py-5 rounded-2xl border-white/5 text-white/60">
            Register Another User
          </Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-12 md:gap-16">
      <div className="w-full max-w-2xl px-2 mt-4 md:mt-0">
        <RoadProgressBar currentStep={currentStep} totalSteps={STEPS.length} />
      </div>

      <div className="w-full flex justify-center py-4">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};
