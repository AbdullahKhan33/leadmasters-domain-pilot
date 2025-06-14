
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import Icon from './Icon';
import DomainStatus from './DomainStatus';
import EmailPreview from './EmailPreview';

const steps = [
  { id: 1, name: "Domain Name" },
  { id: 2, name: "DNS Records" },
  { id: 3, name: "Sender Profile" },
  { id: 4, name: "Branding" },
  { id: 5, name: "Test Email" },
  { id: 6, name: "Finish" },
];

const dnsRecords = [
    { type: 'SPF', host: 'newsletter.clientdomain.com', value: 'v=spf1 include:leadmasters.com ~all' },
    { type: 'DKIM', host: 'lm1._domainkey.newsletter', value: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD...' },
    { type: 'DMARC', host: '_dmarc.newsletter', value: 'v=DMARC1; p=none;' }
];

const EmailSetup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [domainName, setDomainName] = useState('newsletter.clientdomain.com');
  const [senderName, setSenderName] = useState('Your Name');
  const [fromEmail, setFromEmail] = useState('newsletter@clientdomain.com');
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [accentColor, setAccentColor] = useState('#8B5CF6');
  const [unsubscribeFooter, setUnsubscribeFooter] = useState('123 Main St, Anytown, USA');
  const [testSubject, setTestSubject] = useState('This is a test email');
  const [testBody, setTestBody] = useState('Hello! This email confirms your domain is set up correctly.');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDnsCheck = () => {
    setVerificationStatus('verifying');
    toast.info("Checking DNS records...");
    setTimeout(() => {
        const success = Math.random() > 0.3; // Simulate API call
        if (success) {
            setVerificationStatus('verified');
            toast.success("Domain verified successfully!");
        } else {
            setVerificationStatus('failed');
            toast.error("DNS verification failed. Please check your records.");
        }
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="font-semibold text-lg">Enter your sending domain</h3>
            <p className="text-muted-foreground text-sm mb-4">We'll help you authenticate this domain for email.</p>
            <Label htmlFor="domain">Domain Name</Label>
            <Input id="domain" value={domainName} onChange={(e) => setDomainName(e.target.value)} placeholder="newsletter.yourbrand.com" />
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="font-semibold text-lg">Add DNS Records</h3>
            <p className="text-muted-foreground text-sm mb-4">Add these records to your domain provider to verify your domain.</p>
            <div className="space-y-4">
              {dnsRecords.map(record => (
                <div key={record.type} className="p-3 bg-slate-50 rounded-md border">
                  <p className="font-semibold">{record.type} Record</p>
                  <div className="text-sm space-y-2 mt-2">
                    <p><strong>Host:</strong> <code className="bg-slate-200 p-1 rounded text-xs">{record.host}</code><Button variant="ghost" size="sm" className="ml-2" onClick={() => copyToClipboard(record.host)}><Icon name="Copy" className="h-3 w-3"/></Button></p>
                    <p><strong>Value:</strong> <code className="bg-slate-200 p-1 rounded text-xs truncate inline-block max-w-xs">{record.value}</code><Button variant="ghost" size="sm" className="ml-2" onClick={() => copyToClipboard(record.value)}><Icon name="Copy" className="h-3 w-3"/></Button></p>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={handleDnsCheck} className="mt-4" disabled={verificationStatus === 'verifying'}>
              {verificationStatus === 'verifying' ? <Icon name="Loader" className="animate-spin mr-2"/> : null} Check DNS
            </Button>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="font-semibold text-lg">Setup Sender Profile</h3>
            <p className="text-muted-foreground text-sm mb-4">This is who your emails will come from.</p>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="senderName">Sender Name</Label>
                    <Input id="senderName" value={senderName} onChange={e => setSenderName(e.target.value)} placeholder="Your Company" />
                </div>
                <div>
                    <Label htmlFor="fromEmail">Default 'From' Email</Label>
                    <Input id="fromEmail" value={fromEmail} onChange={e => setFromEmail(e.target.value)} placeholder="hello@yourbrand.com" />
                </div>
            </div>
          </div>
        );
      case 4:
        return (
            <div>
              <h3 className="font-semibold text-lg">Customize Your Branding</h3>
              <p className="text-muted-foreground text-sm mb-4">Add your logo and brand color for emails.</p>
              <div className="space-y-4">
                <div>
                    <Label>Logo</Label>
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={logo} />
                            <AvatarFallback><Icon name="Image" /></AvatarFallback>
                        </Avatar>
                        <Input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                setLogo(URL.createObjectURL(e.target.files[0]));
                            }
                        }} />
                        <Button asChild variant="outline"><Label htmlFor="logo-upload" className="cursor-pointer">Upload Logo</Label></Button>
                    </div>
                </div>
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <Input id="accentColor" type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className="w-12 h-10 p-1" />
                    <Input value={accentColor} onChange={e => setAccentColor(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="footer">Unsubscribe Footer</Label>
                  <Textarea id="footer" value={unsubscribeFooter} onChange={e => setUnsubscribeFooter(e.target.value)} placeholder="Your Company Inc. 123 Street, City" />
                </div>
              </div>
            </div>
        );
      case 5:
        return (
            <div>
              <h3 className="font-semibold text-lg">Send a Test Email</h3>
              <p className="text-muted-foreground text-sm mb-4">Make sure everything looks perfect before sending to your list.</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="testSubject">Subject</Label>
                  <Input id="testSubject" value={testSubject} onChange={e => setTestSubject(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="testBody">Body</Label>
                  <Textarea id="testBody" value={testBody} onChange={e => setTestBody(e.target.value)} />
                </div>
                <Button onClick={() => toast.success("Test email sent!", {description: "Check your inbox for the test email."})}><Icon name="Send" className="mr-2 h-4 w-4" /> Send Test Email</Button>
              </div>
            </div>
        );
      case 6:
        return (
            <div className="text-center py-8">
                <Icon name="PartyPopper" className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-2xl">Setup Complete!</h3>
                <p className="text-muted-foreground mt-2">You're ready to launch your first campaign!</p>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left Column */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Email Domain Setup</CardTitle>
            <CardDescription>Follow the steps to authenticate your domain and start sending emails.</CardDescription>
            <div className="flex items-center gap-2 pt-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= step.id ? 'bg-primary border-primary text-white' : 'bg-slate-100'}`}>
                      {currentStep > step.id ? <Icon name="Check" size={16} /> : step.id}
                    </div>
                    <p className={`text-xs mt-1 ${currentStep >= step.id ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{step.name}</p>
                  </div>
                  {index < steps.length - 1 && <div className={`flex-1 h-0.5 ${currentStep > step.id ? 'bg-primary' : 'bg-slate-200'}`} />}
                </React.Fragment>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && currentStep < steps.length && (
                <Button variant="outline" onClick={handleBack}>Back</Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button onClick={handleNext}>Next <Icon name="ArrowRight" className="ml-2 h-4 w-4"/></Button>
              )}
               {currentStep === steps.length - 1 && (
                <Button onClick={handleNext} disabled={verificationStatus !== 'verified'}>
                    Finish Setup
                </Button>
              )}
              {currentStep === steps.length && (
                <Button className="w-full">Create First Campaign</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Right Column */}
      <div className="lg:col-span-1 space-y-6 sticky top-8">
        <DomainStatus status={verificationStatus} domain={domainName} />
        <EmailPreview 
            senderName={senderName}
            fromEmail={fromEmail}
            logoUrl={logo}
            accentColor={accentColor}
            subject={testSubject}
            body={testBody}
            footer={unsubscribeFooter}
        />
      </div>
    </div>
  );
};

export default EmailSetup;
