import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContactPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get in touch with our team for any inquiries or support
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Phone</h3>
                    <p className="text-muted-foreground mb-2">
                      Call us during business hours
                    </p>
                    <a
                      href="tel:02012345678"
                      className="text-primary hover:underline font-medium"
                    >
                      020 1234 5678
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Email</h3>
                    <p className="text-muted-foreground mb-2">
                      Send us an email anytime
                    </p>
                    <a
                      href="mailto:info@ukprintpro.co.uk"
                      className="text-primary hover:underline font-medium"
                    >
                      info@ukprintpro.co.uk
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Address</h3>
                    <p className="text-muted-foreground mb-2">
                      Visit our office
                    </p>
                    <p className="font-medium">
                      123 Print Street<br />
                      London, UK<br />
                      SW1A 1AA
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                    <div className="space-y-1 text-muted-foreground">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Need a Quote?</h2>
                <p className="text-muted-foreground mb-6">
                  For custom printing projects, we recommend requesting a detailed quote. Our team will review your requirements and provide a personalized estimate.
                </p>
                <Link to="/quote">
                  <Button size="lg" className="w-full mb-6">
                    Request a Quote
                  </Button>
                </Link>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-1">What file formats do you accept?</p>
                      <p className="text-sm text-muted-foreground">
                        We accept PDF, AI, EPS, and high-resolution image files (JPG, PNG).
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">What is your typical turnaround time?</p>
                      <p className="text-sm text-muted-foreground">
                        Standard orders are typically completed within 3-5 business days. Rush services are available.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Do you offer design services?</p>
                      <p className="text-sm text-muted-foreground">
                        Yes, we offer professional design consultation and services for an additional fee.
                      </p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">What are your minimum order quantities?</p>
                      <p className="text-sm text-muted-foreground">
                        Minimum quantities vary by product. Contact us for specific requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
