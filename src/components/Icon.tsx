
import React from 'react';
import { icons, LucideProps } from 'lucide-react';

// This is a workaround to use dynamic icon names with lucide-react.
// The `icons` object contains all lucide-react icons.
// We can use a string name to get the icon component.
// This is useful when the icon name is stored in a database or comes from a CMS.

interface IconProps extends LucideProps {
  name: keyof typeof icons;
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name];
  if (!LucideIcon) {
    // Fallback to a default icon or null if the icon name is not found
    return null;
  }
  return <LucideIcon {...props} />;
};

export default Icon;
