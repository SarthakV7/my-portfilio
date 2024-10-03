'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useAnimation, useMotionValue, useSpring } from 'framer-motion'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { ChevronDown, Github, Linkedin, Mail, Award, Book, Code, FileText } from 'lucide-react'


const CursorGlow = () => {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16)
      cursorY.set(e.clientY - 16)
    }

    window.addEventListener('mousemove', moveCursor)
    return () => {
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [cursorX, cursorY])

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        background: `radial-gradient(600px at ${cursorXSpring}px ${cursorYSpring}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
      }}
    />
  )
}

const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    await console.log(container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: 'push',
            },
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: '#FF204E',
          },
          links: {
            color: '#A0153E',
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 100,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 4 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

const AnimatedCard = ({ children, delay = 0 }) => {
  const controls = useAnimation()
  const cardRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start({
            opacity: 0.9,
            y: 0,
            transition: { duration: 0.5, delay },
          })
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [controls, delay])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="rounded-lg bg-white bg-opacity-0 p-6 backdrop-blur-md transition-all duration-300 hover:bg-opacity-10"
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.div>
  )
}

const SkillBar = ({ skill, level }) => {
  const barRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (barRef.current) {
      observer.observe(barRef.current)
    }

    return () => {
      if (barRef.current) {
        observer.unobserve(barRef.current)
      }
    }
  }, [])

  return (
    <div className="mb-4" ref={barRef}>
      <div className="mb-2 flex justify-between">
        <span className="text-sm font-medium text-sulphur-yellow">{skill}</span>
        <span className="text-sm font-medium text-font-secondary">{level}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-700">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-sulphur-yellow to-sap-green"
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${level}%` : 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

export default function EnhancedInteractivePortfolio() {
  const [activeSection, setActiveSection] = useState('home')
  const sectionRefs = {
    home: useRef(null),
    about: useRef(null),
    skills: useRef(null),
    experience: useRef(null),
    publications: useRef(null),
    projects: useRef(null),
    education: useRef(null),
    contact: useRef(null),
  }

  useEffect(() => {
    const handleScroll = () => {
      for (const [section, ref] of Object.entries(sectionRefs)) {
        if (ref.current && ref.current.getBoundingClientRect().top <= 100) {
          setActiveSection(section)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionRefs])

  const scrollToSection = (sectionKey: string) => {
    const section = sectionRefs[sectionKey].current;
    if (section) {
      const navHeight = 64; // Adjust this value to match your navigation bar height
      const sectionTop = section.offsetTop - navHeight;
      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white pt-16 sm:pt-20">
      <CursorGlow />
      <ParticleBackground />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-20 backdrop-blur-md">
        <ul className="flex flex-wrap justify-center space-x-4 p-4 text-sm md:space-x-8 md:text-base">
          {Object.keys(sectionRefs).map((section) => (
            <li key={section}>
              <button
                onClick={() => scrollToSection(section)}
                className={`font-semibold transition-colors ${
                  activeSection === section ? 'text-sulphur-yellow' : 'text-white hover:text-sap-green'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section
        ref={sectionRefs.home}
        className="flex h-screen items-center justify-center"
      >
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-4 text-4xl font-bold text-sulphur-yellow md:text-6xl"
          >
            Sarthak Vajpayee
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl text-sulphur-yellow md:text-2xl"
          >
            Data Scientist | ML Engineer | AI Enthusiast
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10"
        >
          <ChevronDown
            size={48}
            className="animate-bounce cursor-pointer text-sulphur-yellow"
            onClick={() => scrollToSection('about')}
          />
        </motion.div>
      </section>

      <section
        ref={sectionRefs.about}
        className="flex min-h-screen items-center justify-center py-8 px-8"
      >
        <div className="max-w-4xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-sulphur-yellow">About Me</h2>
          <AnimatedCard>
            <p className="mb-4 text-lg">
              I am an accomplished Data Scientist and Machine Learning Engineer with 5+ years of
              expertise in Natural Language Processing (NLP) and deep learning. My analytical and
              technical expertise was refined at the University of Texas at Dallas, focusing on Data
              Science within Business Analytics.
            </p>
            <p className="mb-4 text-lg">
              With a proven track record of developing AI/ML solutions, I excel at extracting valuable
              insights from unstructured data, leveraging expertise in prompt engineering, GPU
              computing, and transformer-based architectures. I&apos;ve successfully fine-tuned models like
              LLaMA, Mistral, BERT, and other state-of-the-art language models using Hugging Face
              Transformers, Bits & Bytes, and Langchain.
            </p>
            <p className="text-lg">
              I am driven by a passion to apply my knowledge and skills in real-world applications,
              continually seeking innovative ways to leverage data for impactful results. With strong
              communication skills and a willingness to relocate, I&apos;m excited to collaborate with
              forward-thinking organizations.
            </p>
          </AnimatedCard>
        </div>
      </section>

      <section
        ref={sectionRefs.skills}
        className="flex min-h-screen items-center justify-center py-8 px-8"
      >
        <div className="max-w-4xl w-full">
          <h2 className="mb-12 text-4xl font-bold text-sulphur-yellow text-center">Skills</h2>
          <div className="grid gap-8 md:grid-cols-2 mb-8">
            <AnimatedCard delay={0.2}>
              <h3 className="mb-6 text-2xl text-center font-semibold text-sulphur-yellow">Technical Skills</h3>
              <div className="space-y-4">
                <SkillBar skill="Python" level={95} />
                <SkillBar skill="Machine Learning" level={90} />
                <SkillBar skill="Deep Learning" level={85} />
                <SkillBar skill="NLP" level={92} />
                <SkillBar skill="Big Data" level={88} />
              </div>
            </AnimatedCard>
            <AnimatedCard delay={0.4}>
              <h3 className="mb-6 text-2xl text-center font-semibold text-sulphur-yellow">Tools & Frameworks</h3>
              <div className="space-y-4">
                <SkillBar skill="TensorFlow" level={88} />
                <SkillBar skill="PyTorch" level={85} />
                <SkillBar skill="Scikit-Learn" level={92} />
                <SkillBar skill="Hugging Face" level={90} />
                <SkillBar skill="LangChain" level={85} />
              </div>
            </AnimatedCard>
          </div>
          <AnimatedCard delay={0.6}>
            <h3 className="mb-6 text-2xl text-center font-semibold text-sulphur-yellow">Soft Skills</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['Problem Solving', 'Team Collaboration', 'Communication', 'Project Management', 'Adaptability'].map((skill, index) => (
                <motion.span
                  key={index}
                  className="rounded-full bg-sap-green bg-opacity-20 px-4 py-2 text-sm"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(160, 21, 62, 0.3)' }}
                  transition={{ duration: 0.2 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </AnimatedCard>
        </div>
      </section>

      <section
        ref={sectionRefs.experience}
        className="flex min-h-screen items-center justify-center py-8 px-8"
      >
        <div className="max-w-4xl w-full">
          <h2 className="mb-12 text-4xl font-bold text-sulphur-yellow text-center">Experience</h2>
          <div className="space-y-4">
            <AnimatedCard delay={0.2}>
              <h3 className="mb-3 text-2xl text-center font-semibold text-sulphur-yellow">
                Research Assistant - The University of Texas at Dallas
              </h3>
              <p className="mb-4 text-center text-sap-green">January 2024 - August 2024</p>
              <ul className="list-disc text-left text-lg space-y-3 pl-5">
                <li>
                  Boosted research efficiency by 10x by developing a Retrieval-Augmented Generator
                  (RAG) leveraging Large Language Models (LLMs), LangChain, Pinecone Vector
                  Database, text embeddings, and Python.
                </li>
                <li>
                  Surpassed existing state-of-the-art sentiment classification research by 20%
                  through fine-tuning transformer models (T5, BERT, Mistral, LLaMA) using PEFT
                  techniques (QLoRA), Hugging Face, PyTorch, and Bits & Bytes.
                </li>
                <li>
                  Enhanced Transformer models (BERT, DistilBERT, RoBERTa) using PEFT techniques
                  (QLoRA, IA3) with Hugging Face in Python, achieving 40% improvement in F1
                  micro-score for classification tasks.
                </li>
              </ul>
            </AnimatedCard>
            
            <AnimatedCard delay={0.4}>
              <h3 className="mb-3 text-2xl text-center font-semibold text-sulphur-yellow">
                AI Software Engineer - AppSteer
              </h3>
              <p className="mb-4 text-center text-sap-green">May 2023 - December 2023</p>
              <ul className="list-disc text-left text-lg space-y-3 pl-5">
                <li>
                  Catalyzed $200K in revenue by pioneering an Agent-based Q&A ChatBot, leveraging
                  Large Language Models (LLMs), LangChain, Python, PySpark, and PostgreSQL to reduce
                  error rates by 50% through expert prompt engineering.
                </li>
                <li>
                  Accelerated time-to-market from 4 days to 2 minutes, revolutionizing application
                  development and deployment through automation using FastAPI,
                  Pydantic, Docker, LangChain, Hugging Face, PyTorch, and OpenAI on Azure.
                </li>
                <li>
                  Enhanced deployment rate by 20% by orchestrating over 50 cloud ETL deployments,
                  streamlining CI/CD workflows with Git version control, Jenkins, Kubernetes, and
                  Prometheus.
                </li>
              </ul>
            </AnimatedCard>
            
            <AnimatedCard delay={0.6}>
              <h3 className="mb-3 text-2xl text-center font-semibold text-sulphur-yellow">Data Scientist - EY</h3>
              <p className="mb-4 text-center text-sap-green">December 2021 - July 2022</p>
              <ul className="list-disc text-left text-lg space-y-3 pl-5">
                <li>
                  Drove $1.1M in annual cost savings by optimizing sales forecast models through
                  efficient data processing with Azure Databricks and strategic feature engineering
                  techniques with Azure ML, resulting in an 8% improvement in demand forecast
                  accuracy.
                </li>
                <li>
                  Set new benchmarks in international market analytics by developing a cutting-edge,
                  second-generation predictive system combining ARIMA and XGBoost in PySpark for
                  advanced data modeling, achieving a remarkable Mean Absolute Percentage Error
                  (MAPE) of 10% within 15 days.
                </li>
                <li>
                  Boosted forecast accuracy by 15% through meticulous time-series analysis and A/B
                  testing, leveraging Tableau dashboards for enhanced data visualization and
                  insights into critical demand trends.
                </li>
              </ul>
            </AnimatedCard>
          </div>
        </div>
      </section>

      <section
        ref={sectionRefs.publications}
        className="flex min-h-screen items-center justify-center py-8 px-8"
      >
        <div className="max-w-4xl text-center space-y-4">
          <h2 className="mb-8 text-4xl font-bold text-sulphur-yellow">Publications</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatedCard delay={0.2}>
            <a 
              href="https://sarthakv7.github.io/my_folio/assets/pdf/covid_19_cough.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <Book className="mb-4 h-8 w-8 text-sap-green" />
              <h3 className="mb-2 text-xl font-semibold text-sap-green">
                COVID-19 Diagnostics through AI
              </h3>
              <p className="text-lg">
                Developed an AI-powered COVID-19 diagnostic tool that matches the accuracy of traditional tests.
              </p>
            </a>
            </AnimatedCard>
            <AnimatedCard delay={0.3}>
            <a 
              href="https://sarthakv7.github.io/my_folio/assets/pdf/HCC_paper.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <Book className="mb-4 h-8 w-8 text-sap-green" />
              <h3 className="mb-2 text-xl font-semibold text-sap-green">
                AI-Driven Liver Cancer Diagnosis
              </h3>
              <p className="text-lg">
              Created a life-saving tool that predicts mortality risk with high accuracy, enabling clinicians to make informed decisions
              </p>
            </a>
            </AnimatedCard>
            <AnimatedCard delay={0.2}>
            <a 
              href="https://sarthakv7.github.io/my_folio//blog/2020/Transformers/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <Book className="mb-4 h-8 w-8 text-sap-green" />
              <h3 className="mb-2 text-xl font-semibold text-sap-green">
                Transformers (State-of-the-art NLP)
              </h3>
              <p className="text-lg">
                An in-depth exploration of transformer architectures and their applications in NLP.
              </p>
            </a>
            </AnimatedCard>
            <AnimatedCard delay={0.3}>
            <a 
              href="https://towardsdatascience.com/how-i-used-machine-learning-to-strategize-my-gre-preparation-75e904a63fd8"
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <Book className="mb-4 h-8 w-8 text-sap-green" />
              <h3 className="mb-2 text-xl font-semibold text-sap-green">
                Cracking the GRE with AI!
              </h3>
              <p className="text-lg">
                A case study on applying ML & NLP techniques to optimize standardized test preparation.
              </p>
            </a>
            </AnimatedCard>
          </div>
          <AnimatedCard delay={0.6}>
            <a 
              href="https://medium.com/@itssarthakvajpayee" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center text-sap-green hover:text-sulphur-yellow transition-colors duration-300 cursor-pointer"
            >
              <p>More Publications</p>
            </a>
          </AnimatedCard>
        </div>
      </section>

      <section
        ref={sectionRefs.projects}
        className="flex min-h-screen items-center justify-center py-8 px-8"
      >
        <div className="max-w-4xl text-center space-y-4">
          <h2 className="mb-8 text-4xl font-bold text-sulphur-yellow">Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <AnimatedCard delay={0.2}>
            <a 
              href="https://your-project-url.com/ai-chatbot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <Code className="mb-4 h-8 w-8 text-sap-green" />
              <h3 className="mb-2 text-xl font-semibold text-sap-green">
              Sentiment Analysis for Social Media Marketing
              </h3>
              <p className="text-lg">
              Created a real-time sentiment analysis tool for Twitter data, helping businesses gauge public opinion on their products.
              </p>
            </a>
            </AnimatedCard>
            <AnimatedCard delay={0.3}>
            <a 
              href="https://github.com/SarthakV7/TableTalk_AI/tree/main" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <Code className="mb-4 h-8 w-8 text-sap-green" />
              <h3 className="mb-2 text-xl font-semibold text-sap-green">
                TableTalk: AI-Powered Data Analysis Chatbot
              </h3>
              <p className="text-lg">
                Developed a proof-of-concept chatbot using Agentic AI to demonstrate intuitive data analysis and visualization capabilities.
              </p>
            </a>
            </AnimatedCard>
            <AnimatedCard delay={0.4}>
            <a 
              href="https://www.kaggle.com/code/sarthakvajpayee/attention-mechanism-japanese-english" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <Code className="mb-4 h-8 w-8 text-sap-green" />
              <h3 className="mb-2 text-xl font-semibold text-sap-green">
                ㊟ Attention Mechanism! Japanese → English
              </h3>
              <p className="text-lg">
                Developed a chatbot using GPT-3 and custom fine-tuning to handle customer inquiries, reducing response time by 60%.
              </p>
            </a>
            </AnimatedCard>
            <AnimatedCard delay={0.5}>
            <a 
              href="https://www.kaggle.com/code/sarthakvajpayee/top-6-linear-models-only" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              <Code className="mb-4 h-8 w-8 text-sap-green" />
              <h3 className="mb-2 text-xl font-semibold text-sap-green">
                Global Top 5% in Google Quest Q&A Challenge
              </h3>
              <p className="text-lg">
                Developed a chatbot using GPT-3 and custom fine-tuning to handle customer inquiries, reducing response time by 60%.
              </p>
            </a>
            </AnimatedCard>
          </div>
          <AnimatedCard delay={0.6}>
            <a 
              href="https://sarthakv7.github.io/my_folio/projects/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-center text-sap-green hover:text-sulphur-yellow transition-colors duration-300 cursor-pointer"
            >
              <p>More Projects</p>
            </a>
          </AnimatedCard>
        </div>
      </section>

      <section
        ref={sectionRefs.education}
        className="flex min-h-screen items-center justify-center py-8 px-8 mt-12"
      >
        <div className="max-w-4xl text-center space-y-4">
          <h2 className="mb-8 text-4xl font-bold text-sulphur-yellow">Education</h2>
          <AnimatedCard delay={0.2}>
            <h3 className="mb-2 text-2xl font-semibold text-sulphur-yellow">
              Master of Science in Business Analytics
            </h3>
            <p className="text-lg">The University of Texas at Dallas, USA</p>
            <p className="text-sap-green">August 2022 - August 2024</p>
          </AnimatedCard>
          <AnimatedCard delay={0.4}>
            <h3 className="mb-2 text-2xl font-semibold text-sulphur-yellow">
              Bachelor of Engineering in Electronics Engineering
            </h3>
            <p className="text-lg">Dr. A.P.J. Abdul Kalam Technical University, India</p>
            <p className="text-sap-green">August 2014 - June 2018</p>
          </AnimatedCard>
          <AnimatedCard delay={0.6}>
            <h3 className="mb-4 text-2xl font-semibold text-sulphur-yellow">Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-3">
              <li>
                <motion.a
                  href="https://www.coursera.org/account/accomplishments/specialization/certificate/XAQLRNAVSFXS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white bg-opacity-20 p-2 transition-all hover:bg-opacity-30 flex items-center cursor-pointer"
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(160, 21, 62, 0.3)' }}
                >
                  <div className="flex items-center mr-3">
                    <Award className="h-5 w-5 text-sap-green mr-2 flex-shrink-0" />
                    <p className="text-xs text-gray-300">Google</p>
                  </div>
                  <p className="text-sm">Advanced Machine Learning on GCP</p>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="https://www.coursera.org/account/accomplishments/certificate/KQDBE7DBHDLV"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white bg-opacity-20 p-2 transition-all hover:bg-opacity-30 flex items-center cursor-pointer"
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(160, 21, 62, 0.3)' }}
                >
                  <div className="flex items-center mr-3">
                    <Award className="h-5 w-5 text-sap-green mr-2 flex-shrink-0" />
                    <p className="text-xs text-gray-300">Google</p>
                  </div>
                  <p className="text-sm">Production Machine Learning Systems</p>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="https://www.coursera.org/account/accomplishments/certificate/MUKWDUTEA9YL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white bg-opacity-20 p-2 transition-all hover:bg-opacity-30 flex items-center cursor-pointer"
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(160, 21, 62, 0.3)' }}
                >
                  <div className="flex items-center mr-3">
                    <Award className="h-5 w-5 text-sap-green mr-2 flex-shrink-0" />
                    <p className="text-xs text-gray-300">Google</p>
                  </div>
                  <p className="text-sm">Time Series and Natural Language Processing</p>
                </motion.a>
              </li>
            </ul>
            
            <ul className="space-y-3">
              <li>
                <motion.a
                  href="https://www.appliedaicourse.com/certificate/928a53bd16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white bg-opacity-20 p-2 transition-all hover:bg-opacity-30 flex items-center cursor-pointer"
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(160, 21, 62, 0.3)' }}
                >
                  <div className="flex items-center mr-3">
                    <Award className="h-5 w-5 text-sap-green mr-2 flex-shrink-0" />
                    <p className="text-xs text-gray-300">InterviewBit</p>
                  </div>
                  <p className="text-sm">Certified Data Scientist</p>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="https://www.coursera.org/account/accomplishments/specialization/certificate/PPYLHGUCB7BH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white bg-opacity-20 p-2 transition-all hover:bg-opacity-30 flex items-center cursor-pointer"
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(160, 21, 62, 0.3)' }}
                >
                  <div className="flex items-center mr-3">
                    <Award className="h-5 w-5 text-sap-green mr-2 flex-shrink-0" />
                    <p className="text-xs text-gray-300">DeepLearning.AI</p>
                  </div>
                  <p className="text-sm">Deep Learning Specialization</p>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="https://skillshop.exceedlms.com/student/path/508845-google-analytics-certification"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white bg-opacity-20 p-2 transition-all hover:bg-opacity-30 flex items-center cursor-pointer"
                  whileHover={{ scale: 1.03, backgroundColor: 'rgba(160, 21, 62, 0.3)' }}
                >
                  <div className="flex items-center mr-3">
                    <Award className="h-5 w-5 text-sap-green mr-2 flex-shrink-0" />
                    <p className="text-xs text-gray-300">Google</p>
                  </div>
                  <p className="text-sm">Google Analytics Certification</p>
                </motion.a>
              </li>
            </ul>
          </div>
          <li>
            <motion.a
              href="https://sarthakv7.github.io/my_folio/teaching/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white bg-opacity-0 p-2 transition-all hover:bg-opacity-30 flex items-center justify-center cursor-pointer w-full"
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(160, 21, 62, 0.3)' }}
            >
              <p className="text-sap-green text-center">More Certifications</p>
            </motion.a>
          </li>
          </AnimatedCard>
        </div>
      </section>

      <section
        ref={sectionRefs.contact}
        className="flex min-h-screen items-center justify-center py-8 px-8"
      >
        <div className="max-w-4xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-sulphur-yellow">Contact</h2>
          <AnimatedCard>
            <p className="mb-8 text-lg">
              I'm always open to new opportunities and collaborations. Feel free to reach out!
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <motion.a
                href="mailto:sarthak.vajpayee05@gmail.com"
                className="flex items-center text-sulphur-yellow transition-colors hover:text-sap-green"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Mail size={24} className="mr-2" />
                <span>Email</span>
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/sarthak-vajpayee"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sulphur-yellow transition-colors hover:text-sap-green"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Linkedin size={24} className="mr-2" />
                <span>LinkedIn</span>
              </motion.a>
              <motion.a
                href="https://github.com/sarthakv7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sulphur-yellow transition-colors hover:text-sap-green"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Github size={24} className="mr-2" />
                <span>Github</span>
              </motion.a>
              <motion.a
                href="https://github.com/SarthakV7/Curriculum-vitae/blob/725c4f00b1742391b9eaca9ce5a7f63cff0d400d/Sarthak_Vajpayee_Resume_24.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sulphur-yellow transition-colors hover:text-sap-green"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <FileText size={24} className="mr-2" />
                <span>Resume</span>
              </motion.a>
            </div>
          </AnimatedCard>
        </div>
      </section>
    </div>
  )
}