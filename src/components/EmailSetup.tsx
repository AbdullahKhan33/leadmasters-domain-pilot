
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  const [domainName, setDomainName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [fromEmail, setFromEmail] = useState('');
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [accentColor, setAccentColor] = useState('#8B5CF6');
  const [unsubscribeFooter, setUnsubscribeFooter] = useState('');
  const [testSubject, setTestSubject] = useState('Test Email from Your Domain');
  const [testBody, setTestBody] = useState('This is a test email to verify that your domain authentication is working correctly. If you received this email, your setup is complete!');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'failed'>('idle');
  const [testEmailSent, setTestEmailSent] = useState(false);

  // Validation functions
  const validateDomain = (domain: string) => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return domainName && validateDomain(domainName);
      case 2:
        return verificationStatus === 'verified';
      case 3:
        return senderName && fromEmail && validateEmail(fromEmail);
      case 4:
        return senderName && fromEmail && unsubscribeFooter;
      case 5:
        return testSubject && testBody && testEmailSent;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceedToNextStep()) {
      let errorMessage = '';
      switch (currentStep) {
        case 1:
          errorMessage = 'Please enter a valid domain name';
          break;
        case 2:
          errorMessage = 'Please verify your DNS records first';
          break;
        case 3:
          errorMessage = 'Please fill in all sender profile fields with valid information';
          break;
        case 4:
          errorMessage = 'Please complete all branding fields';
          break;
        case 5:
          errorMessage = 'Please send a test email first';
          break;
      }
      toast.error(errorMessage);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDnsCheck = () => {
    if (!domainName) {
      toast.error("Please enter a domain name first");
      return;
    }
    
    setVerificationStatus('verifying');
    toast.info("Checking DNS records...");
    
    // Update DNS records to use the actual domain
    const updatedRecords = dnsRecords.map(record => ({
      ...record,
      host: record.host.replace('newsletter.clientdomain.com', domainName).replace('newsletter', domainName.split('.')[0])
    }));
    
    setTimeout(() => {
        const success = Math.random() > 0.2; // Higher success rate for demo
        if (success) {
            setVerificationStatus('verified');
            toast.success("Domain verified successfully! You can now proceed to the next step.");
        } else {
            setVerificationStatus('failed');
            toast.error("DNS verification failed. Please check your records and try again.");
        }
    }, 3000);
  };

  const handleTestEmail = () => {
    if (!testSubject || !testBody) {
      toast.error("Please fill in both subject and body");
      return;
    }
    
    setTestEmailSent(true);
    toast.success("Test email sent successfully!", {
      description: "Check your inbox for the test email. You can now finish the setup."
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="font-semibold text-lg">Enter your sending domain</h3>
            <p className="text-muted-foreground text-sm mb-4">We'll help you authenticate this domain for email sending. This should be a subdomain like newsletter.yourdomain.com</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain">Domain Name *</Label>
                <Input 
                  id="domain" 
                  value={domainName} 
                  onChange={(e) => setDomainName(e.target.value)} 
                  placeholder="newsletter.yourbrand.com"
                  className={!validateDomain(domainName) && domainName ? "border-red-500" : ""}
                />
                {domainName && !validateDomain(domainName) && (
                  <p className="text-sm text-red-500 mt-1">Please enter a valid domain name</p>
                )}
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">💡 Domain Setup Tips:</h4>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Use a subdomain like newsletter.yourbrand.com or mail.yourbrand.com</li>
                  <li>• Don't use your main domain (yourbrand.com) for email sending</li>
                  <li>• The subdomain should point to your domain registrar</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 2:
        const updatedRecords = dnsRecords.map(record => ({
          ...record,
          host: record.host.replace('newsletter.clientdomain.com', domainName || 'newsletter.yourdomain.com').replace('newsletter', (domainName || 'newsletter.yourdomain.com').split('.')[0])
        }));
        
        return (
          <div>
            <h3 className="font-semibold text-lg">Add DNS Records</h3>
            <p className="text-muted-foreground text-sm mb-4">Add these records to your domain provider to verify your domain. This usually takes 5-10 minutes to propagate.</p>
            <div className="space-y-4">
              {updatedRecords.map(record => (
                <div key={record.type} className="p-4 bg-slate-50 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{record.type} Record</p>
                      <div className="text-sm space-y-2 mt-2">
                        <div>
                          <p className="text-slate-600"><strong>Host/Name:</strong></p>
                          <div className="flex items-center gap-2">
                            <code className="bg-slate-200 p-2 rounded text-xs font-mono flex-1">{record.host}</code>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(record.host)}>
                              <Icon name="Copy" className="h-3 w-3"/>
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-600"><strong>Value:</strong></p>
                          <div className="flex items-center gap-2">
                            <code className="bg-slate-200 p-2 rounded text-xs font-mono flex-1 break-all">{record.value}</code>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(record.value)}>
                              <Icon name="Copy" className="h-3 w-3"/>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4">
              <Button onClick={handleDnsCheck} disabled={verificationStatus === 'verifying'} className="w-full">
                {verificationStatus === 'verifying' ? (
                  <>
                    <Icon name="Loader" className="animate-spin mr-2 h-4 w-4"/> 
                    Checking DNS Records...
                  </>
                ) : (
                  <>
                    <Icon name="Search" className="mr-2 h-4 w-4"/>
                    Verify DNS Records
                  </>
                )}
              </Button>
              <DomainStatus status={verificationStatus} domain={domainName} />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="font-semibold text-lg">Setup Sender Profile</h3>
            <p className="text-muted-foreground text-sm mb-4">Configure who your emails will come from. This information will be visible to recipients.</p>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="senderName">Sender Name *</Label>
                    <Input 
                      id="senderName" 
                      value={senderName} 
                      onChange={e => setSenderName(e.target.value)} 
                      placeholder="Your Company Name" 
                    />
                </div>
                <div>
                    <Label htmlFor="fromEmail">Default 'From' Email *</Label>
                    <Input 
                      id="fromEmail" 
                      value={fromEmail} 
                      onChange={e => setFromEmail(e.target.value)} 
                      placeholder="hello@yourbrand.com"
                      className={fromEmail && !validateEmail(fromEmail) ? "border-red-500" : ""}
                    />
                    {fromEmail && !validateEmail(fromEmail) && (
                      <p className="text-sm text-red-500 mt-1">Please enter a valid email address</p>
                    )}
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900">📧 Email Best Practices:</h4>
                  <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                    <li>• Use a professional sender name that recipients will recognize</li>
                    <li>• The 'from' email should match your verified domain</li>
                    <li>• Avoid using 'noreply' addresses for better engagement</li>
                  </ul>
                </div>
            </div>
          </div>
        );
      case 4:
        return (
            <div>
              <h3 className="font-semibold text-lg">Customize Your Branding</h3>
              <p className="text-muted-foreground text-sm mb-4">Add your logo and brand colors to make emails look professional and on-brand.</p>
              <div className="space-y-6">
                <div>
                    <Label>Company Logo</Label>
                    <div className="flex items-center gap-4 mt-2">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={logo} />
                            <AvatarFallback className="text-lg"><Icon name="Image" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <Input 
                            id="logo-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setLogo(URL.createObjectURL(e.target.files[0]));
                                }
                            }} 
                          />
                          <Button asChild variant="outline">
                            <Label htmlFor="logo-upload" className="cursor-pointer">
                              <Icon name="Upload" className="mr-2 h-4 w-4"/>
                              Upload Logo
                            </Label>
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1">Recommended: 200x200px, PNG or JPG</p>
                        </div>
                    </div>
                </div>
                <div>
                  <Label htmlFor="accentColor">Brand Color</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <Input 
                      id="accentColor" 
                      type="color" 
                      value={accentColor} 
                      onChange={e => setAccentColor(e.target.value)} 
                      className="w-16 h-10 p-1 rounded cursor-pointer" 
                    />
                    <Input 
                      value={accentColor} 
                      onChange={e => setAccentColor(e.target.value)} 
                      placeholder="#8B5CF6"
                      className="font-mono"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="footer">Unsubscribe Footer *</Label>
                  <Textarea 
                    id="footer" 
                    value={unsubscribeFooter} 
                    onChange={e => setUnsubscribeFooter(e.target.value)} 
                    placeholder="Your Company Inc.&#10;123 Business Street&#10;City, State 12345&#10;United States"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Required by law. Include your company name and physical address.</p>
                </div>
              </div>
               <div className="mt-6">
                <EmailPreview 
                    senderName={senderName || "Your Company"}
                    fromEmail={fromEmail || "hello@yourbrand.com"}
                    logoUrl={logo}
                    accentColor={accentColor}
                    subject="Welcome to our newsletter!"
                    body="This is a preview of how your emails will look with your custom branding. Your logo, colors, and footer will appear consistently across all your email campaigns."
                    footer={unsubscribeFooter || "Your Company Inc., 123 Business Street, City, State 12345"}
                />
              </div>
            </div>
        );
      case 5:
        return (
            <div>
              <h3 className="font-semibold text-lg">Send a Test Email</h3>
              <p className="text-muted-foreground text-sm mb-4">Send yourself a test email to make sure everything is working correctly before going live.</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="testSubject">Subject Line *</Label>
                  <Input 
                    id="testSubject" 
                    value={testSubject} 
                    onChange={e => setTestSubject(e.target.value)}
                    placeholder="Test Email Subject"
                  />
                </div>
                <div>
                  <Label htmlFor="testBody">Email Body *</Label>
                  <Textarea 
                    id="testBody" 
                    value={testBody} 
                    onChange={e => setTestBody(e.target.value)}
                    rows={6}
                    placeholder="Write your test email content here..."
                  />
                </div>
                <Button 
                  onClick={handleTestEmail} 
                  disabled={!testSubject || !testBody || testEmailSent}
                  className="w-full"
                >
                  {testEmailSent ? (
                    <>
                      <Icon name="CheckCircle2" className="mr-2 h-4 w-4" />
                      Test Email Sent Successfully
                    </>
                  ) : (
                    <>
                      <Icon name="Send" className="mr-2 h-4 w-4" />
                      Send Test Email
                    </>
                  )}
                </Button>
              </div>
              <div className="mt-6">
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
      case 6:
        return (
            <div className="text-center py-12">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="CheckCircle2" className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-3xl text-green-900">Setup Complete!</h3>
                  <p className="text-muted-foreground mt-3 text-lg max-w-md mx-auto">
                    Your email domain is verified and configured. You're ready to start sending professional emails!
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-left">
                  <div className="p-4 border rounded-lg">
                    <Icon name="Shield" className="h-8 w-8 text-blue-600 mb-2"/>
                    <h4 className="font-medium">Domain Verified</h4>
                    <p className="text-sm text-muted-foreground">Your DNS records are properly configured</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Icon name="User" className="h-8 w-8 text-green-600 mb-2"/>
                    <h4 className="font-medium">Sender Profile Ready</h4>
                    <p className="text-sm text-muted-foreground">Your from name and email are set up</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Icon name="Palette" className="h-8 w-8 text-purple-600 mb-2"/>
                    <h4 className="font-medium">Branding Applied</h4>
                    <p className="text-sm text-muted-foreground">Your emails will look professional</p>
                  </div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Email Domain Setup</CardTitle>
          <CardDescription>Follow the steps to authenticate your domain and start sending emails.</CardDescription>
          <div className="flex items-center gap-2 pt-4 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center min-w-[6rem]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= step.id ? 'bg-primary border-primary text-white' : 'bg-slate-100'}`}>
                    {currentStep > step.id ? <Icon name="Check" size={16} /> : step.id}
                  </div>
                  <p className={`text-xs mt-1 text-center ${currentStep >= step.id ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{step.name}</p>
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
              <Button variant="outline" onClick={handleBack}>
                <Icon name="ArrowLeft" className="mr-2 h-4 w-4"/>
                Back
              </Button>
            )}
            {currentStep < steps.length && currentStep !== steps.length && (
              <Button 
                onClick={handleNext} 
                disabled={!canProceedToNextStep()}
                className="ml-auto"
              >
                {currentStep === steps.length - 1 ? 'Finish Setup' : 'Next'}
                <Icon name="ArrowRight" className="ml-2 h-4 w-4"/>
              </Button>
            )}
            {currentStep === steps.length && (
              <Button className="w-full" size="lg">
                <Icon name="Plus" className="mr-2 h-4 w-4"/>
                Create Your First Campaign
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSetup;
