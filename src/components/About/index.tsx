import Image from "next/image";
import byndLogo from "../../../public/Images/ByndLogo.svg";
import clockSVGIcon from "../../../public/Images/clockSVGIcon.svg";
import chartSVGIcon from "../../../public/Images/chartSVGIcon.svg";
import styles from "@/styles/About.module.scss";

const About = () => {
  return (
    <section className={styles.about}>
      <div className={styles.logoWrapper}>
        <Image src={byndLogo} alt="Bynd Logo" width={80} height={80} />
      </div>

      <h1 className={styles.heading}>
        Next generation of
        <span className={styles.headingHighlight}>
          AI-powered workflow automation
        </span>
      </h1>

      <div className={styles.features}>
        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <Image
              src={clockSVGIcon}
              alt="Time Saving"
              width={24}
              height={24}
            />
          </div>
          <p className={styles.featureText}>
            Save Time and Gain Accuracy Through Automated Workflows
          </p>
        </div>

        <div className={styles.featureItem}>
          <div className={styles.featureIcon}>
            <Image src={chartSVGIcon} alt="Insights" width={24} height={24} />
          </div>
          <p className={styles.featureText}>
            Uncover Deeper Insights by Connecting the Dots Across Data Sources
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
