import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import logo from "@/assets/logo.jpg";
import student1 from "@/assets/student-1.jpg";
import student2 from "@/assets/student-2.jpg";
import student3 from "@/assets/student-3.jpg";
import student4 from "@/assets/student-4.jpg";
import { useWebSocket } from "@/context/socketContext";

const Index = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { resetMessage } = useWebSocket();

  useEffect(() => {
    return () => {
      // when leaving this page, clear the last message
      resetMessage();
    };
  }, [resetMessage]);

  const faqTopics = [
    "See available programs",
    "View payment plans",
    "Career outcomes",
    "Application process",
  ];

  const studentImages = [
    { src: student1, alt: "Business analysis student studying" },
    { src: student2, alt: "Students collaborating on project" },
    { src: student3, alt: "Student presenting data visualization" },
    { src: student4, alt: "Graduates celebrating success" },
  ];

  // Auto-scroll images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % studentImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [studentImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % studentImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + studentImages.length) % studentImages.length
    );
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Full-screen image carousel background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full">
          {studentImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-70" : "opacity-0"
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Carousel navigation */}
        <button
          onClick={prevImage}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {studentImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content overlay */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-6">
            <div className="flex justify-center">
              <img
                src={logo}
                alt="Business Analysis School"
                className="h-20 w-20 rounded-full object-cover shadow-lg"
              />
            </div>
            <div className="space-y-4">
              <CardTitle className="text-4xl font-bold text-white drop-shadow-lg">
                Welcome to the Business Analysis School
              </CardTitle>
              <CardTitle className="text-xl text-white/90">
                Student Support Portal
              </CardTitle>
              <CardDescription className="text-lg text-white/80 max-w-md mx-auto">
                We're here to help you learn more about our programs, payments,
                and career outcomes.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <MessageCircle className="h-8 w-8 mx-auto text-blue-300" />
                <div>
                  <h3 className="font-semibold text-white">Have a question?</h3>
                  <p className="text-sm text-white/70">
                    Start chatting with our AI-powered assistant
                  </p>
                </div>
              </div>
              <div className="space-y-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <Users className="h-8 w-8 mx-auto text-purple-300" />
                <div>
                  <h3 className="font-semibold text-white">
                    Need human support?
                  </h3>
                  <p className="text-sm text-white/70">
                    We'll connect you when necessary
                  </p>
                </div>
              </div>
              <div className="space-y-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <BookOpen className="h-8 w-8 mx-auto text-blue-300" />
                <div>
                  <h3 className="font-semibold text-white">Expert guidance</h3>
                  <p className="text-sm text-white/70">
                    Get answers about programs and careers
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate("/chat")}
              >
                Start Chatting
              </Button>

              <div className="space-y-3">
                <p className="text-center text-sm text-white/70">
                  Popular questions:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {faqTopics.map((topic, index) => (
                    <Badge
                      key={index}
                      className="cursor-pointer bg-white/10 hover:bg-white/20 text-white border-white/20 transition-all duration-200 hover:scale-105"
                      onClick={() =>
                        navigate("/chat", { state: { initialMessage: topic } })
                      }
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
