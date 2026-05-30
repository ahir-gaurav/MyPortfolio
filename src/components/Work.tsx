import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";

// Import images so Vite can bundle them correctly for production
import mockFreeImg from "../assets/mock-free-api.png";
import goldErpImg from "../assets/gold-erp.png";
import dtcAdminImg from "../assets/dtc-admin.png";
import officeTimeImg from "../assets/office-time-management.png";

gsap.registerPlugin(useGSAP);

const projects = [
  {
    id: 1,
    name: "Mocky Free API",
    category: "Free Mock API Service",
    tools: "TypeScript, Next.js, React, Tailwind CSS",
    image: mockFreeImg,
    link: "https://free-mock-a-pi.vercel.app/",
  },
  {
    id: 2,
    name: "Gold ERP System",
    category: "ERP Dashboard for AM Jewellers",
    tools: "React, TypeScript, Charts, Responsive UI",
    image: goldErpImg,
    link: "https://am-jwellers.vercel.app/",
  },
  {
    id: 3,
    name: "DTC Admin Panel",
    category: "Admin Dashboard",
    tools: "React, TypeScript, REST APIs, Protected Routes",
    image: dtcAdminImg,
    link: "https://dtc-admin.netlify.app/",
  },
  {
    id: 4,
    name: "Face Recognition Admin",
    category: "AI-based Attendance / Access Dashboard",
    tools: "React, Face Recognition API, Charts, Responsive UI",
    image: officeTimeImg,
    link: "https://admin-face-recogniton.vercel.app/dashboard",
  },
];

const Work = () => {
  useGSAP(() => {
    let timeline: gsap.core.Timeline | null = null;
    let checkInterval: any = null;
    let safetyTimeout: any = null;

    function initTrigger() {
      let translateX: number = 0;

      function setTranslateX() {
        const flexEl = document.querySelector(".work-flex") as HTMLElement;
        if (!flexEl) return;
        const boxes = flexEl.querySelectorAll(".work-box");
        if (boxes.length === 0) {
          translateX = flexEl.scrollWidth - flexEl.clientWidth;
          return;
        }
        const firstBox = boxes[0] as HTMLElement;
        const lastBox = boxes[boxes.length - 1] as HTMLElement;
        const boxesWidth = lastBox.offsetLeft + lastBox.offsetWidth - firstBox.offsetLeft;
        const style = window.getComputedStyle(flexEl);
        const paddingRight = parseFloat(style.paddingRight) || 0;
        const paddingLeft = parseFloat(style.paddingLeft) || 0;
        translateX = Math.max(0, (boxesWidth + paddingRight + paddingLeft) - flexEl.clientWidth);
      }

      setTranslateX();

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top top",
          end: () => {
            setTranslateX();
            return `+=${translateX}`;
          },
          scrub: true,
          pin: true,
          id: "work",
          invalidateOnRefresh: true,
        },
      });

      timeline.to(".work-flex", {
        x: () => -translateX,
        ease: "none",
      });

      ScrollTrigger.refresh();
    }

    if (ScrollSmoother.get()) {
      initTrigger();
    } else {
      checkInterval = setInterval(() => {
        if (ScrollSmoother.get()) {
          clearInterval(checkInterval);
          initTrigger();
        }
      }, 30);

      safetyTimeout = setTimeout(() => {
        clearInterval(checkInterval);
        if (!timeline) {
          initTrigger();
        }
      }, 600);
    }

    // Delayed refresh to account for layout height updates after the loader fades out
    const timeoutId = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 3500);

    return () => {
      clearInterval(checkInterval);
      clearTimeout(safetyTimeout);
      clearTimeout(timeoutId);
      if (timeline) {
        timeline.kill();
      }
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {projects.map((project, index) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
              </div>
              <WorkImage
                image={project.image}
                alt={project.name}
                link={project.link}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
