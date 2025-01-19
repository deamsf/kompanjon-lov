export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "How do I get started?",
    answer: "Begin by setting up your profile in the Preferences page. Then, you can start organizing your tasks in the Todo page or manage your project files in the Files section."
  },
  {
    question: "Can I share files with others?",
    answer: "Yes, you can share files by selecting them in the Files page and using the share button. You can set passwords and expiration dates for shared files."
  },
  {
    question: "How do I manage my team?",
    answer: "Use the Partners page to add and manage your team members. You can assign them specific project components and track their involvement."
  },
  {
    question: "How do I organize my tasks?",
    answer: "The Todo page allows you to create and organize tasks using a Kanban board. You can drag and drop tasks between different status columns."
  },
  {
    question: "How do I customize my experience?",
    answer: "Visit the Preferences page to customize your profile, notification settings, and display preferences."
  }
];