import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Users, BookOpen } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.jpg";
import student1 from "@/assets/student-1.jpg";
import student2 from "@/assets/student-2.jpg";
import student3 from "@/assets/student-3.jpg";
import student4 from "@/assets/student-4.jpg";

const Index = () => {
  const navigate = useNavigate();

  const faqTopics = [
    "See available programs",
    "View payment plans",
    "Career outcomes",
    "Application process"
  ];

  const studentImages = [
    { src: student1, alt: "Business analysis student studying" },
    { src: student2, alt: "Students collaborating on project" },
    { src: student3, alt: "Student presenting data visualization" },
    { src: student4, alt: "Graduates celebrating success" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-soft">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="Business Analysis School" 
              className="h-20 w-20 rounded-full object-cover"
            />
          </div>
          <div className="space-y-4">
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome to the Business Analysis School
            </CardTitle>
            <CardTitle className="text-xl text-foreground">
              Student Support Portal
            </CardTitle>
            <CardDescription className="text-lg max-w-md mx-auto">
              We're here to help you learn more about our programs, payments, and career outcomes.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Student Images Slideshow */}
          <div className="w-full max-w-md mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {studentImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-[4/3] items-center justify-center p-2">
                          <img 
                            src={image.src} 
                            alt={image.alt}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <MessageCircle className="h-8 w-8 mx-auto text-primary" />
              <div>
                <h3 className="font-semibold">Have a question?</h3>
                <p className="text-sm text-muted-foreground">Start chatting with our AI-powered assistant</p>
              </div>
            </div>
            <div className="space-y-3">
              <Users className="h-8 w-8 mx-auto text-accent" />
              <div>
                <h3 className="font-semibold">Need human support?</h3>
                <p className="text-sm text-muted-foreground">We'll connect you when necessary</p>
              </div>
            </div>
            <div className="space-y-3">
              <BookOpen className="h-8 w-8 mx-auto text-primary" />
              <div>
                <h3 className="font-semibold">Expert guidance</h3>
                <p className="text-sm text-muted-foreground">Get answers about programs and careers</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              size="lg" 
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6"
              onClick={() => navigate('/chat')}
            >
              Start Chatting
            </Button>
            
            <div className="space-y-3">
              <p className="text-center text-sm text-muted-foreground">Popular questions:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {faqTopics.map((topic, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => navigate('/chat', { state: { initialMessage: topic } })}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Index;