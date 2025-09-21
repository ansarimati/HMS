"use client";
import React, { useState } from 'react'
import {
  User,
  Calendar,
  FileText,
  CreditCard,
  MessageSquare,
  Pill,
  Activity,
  AlertTriangle,
  Plus,
  ChevronDown,
  ChevronRight,
  UserCircle,
  History,
  Shield,
  CalendarPlus,
  CalendarDays,
  RotateCcw,
  Bell,
  Video,
  TestTube,
  FileImage,
  Download,
  Receipt,
  Wallet,
  FileBarChart,
  Calculator,
  Send,
  HelpCircle,
  BellRing,
  RefreshCw,
  AlarmClock,
  Info,
  Heart,
  Target,
  Stethoscope,
  Phone, Building,
  ThumbsUp,
  Headphones,
  Users,
  Map,
  BookOpen,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useRouter } from 'next/navigation';


const menuData = [
  {
    id: "profile",
    title: "Profile & Personal Management",
    icon: User,
    items: [
      { id: "personal-info", title: "Personal Information Management", icon: UserCircle, path: "/dashboard/profile" },
      { id: "medical-history", title: "Medical History", icon: History, path: "/dashboard/medical-history" },
      { id: "insurance-details", title: "Insurance Details", icon: Shield, path: "/dashboard/insurance-details" },
    ]
  },
  {
    id: "appointments",
    title: "Appointments & Scheduling",
    icon: Calendar,
    items: [
      { id: "book-appointment", title: "Book Appointments", icon: CalendarPlus },
      { id: "view-appointments", title: "View Appointments", icon: CalendarDays },
      { id: "reschedule", title: "Reschedule/Cancel Appointments", icon: RotateCcw },
      { id: "reminders", title: "Appointment Reminders", icon: Bell },
      { id: "virtual-consultation", title: "Virtual Consultation Bookings", icon: Video },
    ]
  },
  {
    id: "medical-records",
    title: "Medical Records & History",
    icon: FileText,
    items: [
      { id: "lab-results", title: "Lab Test Results", icon: TestTube },
      { id: "prescription-history", title: "Prescription History", icon: FileImage },
      { id: "discharge-summary", title: "Discharge Summaries", icon: FileText },
      { id: "reports-download", title: "Medical Reports Download", icon: Download }, 
    ]
  },
  {
    id: "billing",
    title: "Billing, Payments",
    icon: CreditCard,
    items: [
      { id: "view-bills", title: "View Bills & Invoices", icon: Receipt },
      { id: "online-payment", title: "Online Payment", icon: Wallet },
      { id: "insurance-claims", title: "Insurance Claims Tracking", icon: FileBarChart },
      { id: "payment-plans", title: "Payment Plans", icon: Calculator },
    ]
  },
  {
    id: "communication",
    title: "Communication & Support",
    icon: MessageSquare,
    items: [
      { id: "doctor-messaging", title: "Message Healthcare Providers", icon: Send },
      { id: "health-queries", title: "Health Queries", icon: HelpCircle },
      { id: "notification-center", title: "Notifications & Alerts", icon: BellRing },
    ]
  },
  {
    id: "pharmacy",
    title: "Pharmacy Services",
    icon: Pill,
    items: [
      { id: "prescription-refills", title: "Prescription Refills", icon: RefreshCw },
      { id: "medication-reminders", title: "Medication Reminders", icon: AlarmClock },
      { id: "drug-information", title: "Drug information", icon: Info },
    ]
  },
  {
    id: "health-tracking",
    title: "Health Tracking & Monitoring",
    icon: Activity,
    items: [
      { id: "vital-signs", title: "Vital Signs Monitoring", icon: Heart },
      { id: "health-goals", title: "Health Goals", icon: Target },
      { id: "symptom-checker", title: "Symptom Checker", icon: Stethoscope },
    ]
  },
  {
    id: "emergency",
    title: "Emergency & Support Services",
    icon: AlertTriangle,
    items: [
      { id: "emergency-contacts", title: "Emergency Contacts", icon: Phone },
      { id: "hospital-directory", title: "Hospital Directory", icon: Building },
      { id: "feedback-system", title: "feedback System", icon: ThumbsUp },
      { id: "help-desk", title: "Help Desk", icon: Headphones },
    ]
  },
  {
    id: "additional",
    title: "Additional Convenience Features",
    icon: Plus,
    items: [
      { id: "family-management", title: "Family Account Management", icon: Users },
      { id: "hospital-navigation", title: "Hospital Navigation", icon: Map },
      { id: "health-education", title: "Health Education Resources", icon: BookOpen },
      { id: "document-upload", title: "Document Upload", icon: Upload },
    ]
  }
];

const PatientMenu = () => {
  const [openSection, setOpenSection] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const toggleSection = (sectionId) => {
    setOpenSection(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
  }

  return (
    <div className="w-85 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-600" />
          HealthCare Portal
        </h1>
      </div>

      {/* Menu Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuData.map((section) => (
          <Collapsible
            key={section.id}
            // open={openSection[section.id]}
            // onOpenChange={() => toggleSection(section.id)}
            open={isOpen}
            onOpenChange={setIsOpen}

          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-3 hover:bg-gray-50 font-medium text-gray-700"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="w-5 h-5 text-gray-600" />
                  <span className="text-left font-bold text-sm">{section.title}</span>
                </div>
                {openSection[section.id] ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-1 mt-1">
              {section.items.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start pl-12 pr-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 ${
                    activeItem === item.id ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : ''
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <item.icon className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="text-left" onClick={() => item.path && router.push(item.path)}>{item.title}</span>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button variant="outline" className="w-full justify-start text-gray-600">
          <HelpCircle className="w-4 h-4 mr-2" />
          Support & Help
        </Button>
      </div>
    </div>
  )
}

export default PatientMenu