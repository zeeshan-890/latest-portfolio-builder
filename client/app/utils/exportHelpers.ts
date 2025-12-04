import { jsPDF } from 'jspdf';
import { PortfolioData } from '@/app/store/portfolioStore';

export const handleExport = async (
    format: string,
    portfolioData: PortfolioData
): Promise<void> => {
    try {
        switch (format) {
            case 'pdf':
                await exportToPDF(portfolioData);
                break;
            case 'json':
                exportToJSON(portfolioData);
                break;
            case 'html':
                exportToHTML(portfolioData);
                break;
            case 'png':
                await exportToPNG(portfolioData);
                break;
            default:
                console.error('Unknown export format');
        }
    } catch (error) {
        console.error('Export failed:', error);
        throw error;
    }
};

const exportToPNG = async (data: PortfolioData) => {
    // Create a canvas-based export for PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    canvas.width = 800;
    canvas.height = 1200;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(0.5, '#374151');
    gradient.addColorStop(1, '#4b5563');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let yPos = 60;

    // Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.personal.fullName || 'Your Name', canvas.width / 2, yPos);
    yPos += 50;

    ctx.fillStyle = '#60a5fa';
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText(data.personal.title || 'Your Professional Title', canvas.width / 2, yPos);
    yPos += 60;

    // Contact info
    ctx.fillStyle = '#d1d5db';
    ctx.font = '14px Arial, sans-serif';
    const contactInfo = [];
    if (data.personal.email) contactInfo.push(`📧 ${data.personal.email}`);
    if (data.personal.phone) contactInfo.push(`📱 ${data.personal.phone}`);
    if (data.personal.location) contactInfo.push(`📍 ${data.personal.location}`);

    contactInfo.forEach((info) => {
        ctx.fillText(info, canvas.width / 2, yPos);
        yPos += 25;
    });
    yPos += 30;

    // Summary
    if (data.personal.summary) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillText('Professional Summary', canvas.width / 2, yPos);
        yPos += 35;

        ctx.fillStyle = '#d1d5db';
        ctx.font = '14px Arial, sans-serif';
        const words = data.personal.summary.split(' ');
        let line = '';
        const maxWidth = canvas.width - 100;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, canvas.width / 2, yPos);
                line = words[i] + ' ';
                yPos += 22;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, canvas.width / 2, yPos);
        yPos += 40;
    }

    // Skills
    if (data.skills.technical.length > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillText('Technical Skills', canvas.width / 2, yPos);
        yPos += 35;

        ctx.fillStyle = '#60a5fa';
        ctx.font = '12px Arial, sans-serif';
        const skillsText = data.skills.technical.slice(0, 20).join(' • ');
        ctx.fillText(skillsText, canvas.width / 2, yPos);
        yPos += 40;
    }

    // Experience count
    if (data.experience.length > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial, sans-serif';
        ctx.fillText(`${data.experience.length} Work Experience${data.experience.length > 1 ? 's' : ''}`, canvas.width / 2, yPos);
        yPos += 30;
    }

    // Projects count
    if (data.projects.length > 0) {
        ctx.fillText(`${data.projects.length} Project${data.projects.length > 1 ? 's' : ''}`, canvas.width / 2, yPos);
        yPos += 30;
    }

    // Footer
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial, sans-serif';
    ctx.fillText('Generated with Portfolio Builder Pro', canvas.width / 2, canvas.height - 30);

    // Download
    canvas.toBlob((blob) => {
        if (blob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${data.personal.fullName?.replace(/\s+/g, '_') || 'portfolio'}.png`;
            link.click();
            URL.revokeObjectURL(link.href);
        }
    }, 'image/png', 1.0);
};

const exportToPDF = async (data: PortfolioData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold = false, color = '#000000') => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(color);
        const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
        doc.text(lines, margin, yPos);
        yPos += lines.length * (fontSize * 0.5) + 5;
    };

    // Check if we need a new page
    const checkNewPage = (requiredSpace: number = 30) => {
        if (yPos > doc.internal.pageSize.getHeight() - requiredSpace) {
            doc.addPage();
            yPos = 20;
        }
    };

    // Header - Name and Title
    addText(data.personal.fullName || 'Your Name', 24, true, '#1e40af');
    addText(data.personal.title || 'Professional Title', 14, false, '#4b5563');
    yPos += 5;

    // Contact Info
    const contactInfo = [
        data.personal.email,
        data.personal.phone,
        data.personal.location,
        data.personal.website,
        data.personal.linkedin,
        data.personal.github,
    ]
        .filter(Boolean)
        .join(' | ');
    if (contactInfo) {
        addText(contactInfo, 10, false, '#6b7280');
    }
    yPos += 10;

    // Summary
    if (data.personal.summary) {
        addText('PROFESSIONAL SUMMARY', 12, true, '#1e40af');
        addText(data.personal.summary, 10, false, '#374151');
        yPos += 10;
    }

    // Experience
    if (data.experience.length > 0) {
        checkNewPage();
        addText('EXPERIENCE', 12, true, '#1e40af');
        data.experience.forEach((exp) => {
            checkNewPage();
            addText(`${exp.title} at ${exp.company}`, 11, true);
            addText(
                `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate} | ${exp.location}`,
                9,
                false,
                '#6b7280'
            );
            if (exp.description) {
                addText(exp.description, 10, false, '#374151');
            }
            yPos += 5;
        });
        yPos += 5;
    }

    // Education
    if (data.education.length > 0) {
        checkNewPage();
        addText('EDUCATION', 12, true, '#1e40af');
        data.education.forEach((edu) => {
            checkNewPage();
            addText(`${edu.degree} - ${edu.school}`, 11, true);
            addText(`${edu.startYear} - ${edu.endYear}`, 9, false, '#6b7280');
            if (edu.gpa) {
                addText(`GPA: ${edu.gpa}`, 9, false, '#6b7280');
            }
            yPos += 5;
        });
        yPos += 5;
    }

    // Skills
    const allSkills = [
        ...data.skills.technical,
        ...data.skills.soft,
        ...data.skills.languages,
    ];
    if (allSkills.length > 0) {
        checkNewPage();
        addText('SKILLS', 12, true, '#1e40af');
        addText(allSkills.join(', '), 10, false, '#374151');
        yPos += 10;
    }

    // Projects
    if (data.projects.length > 0) {
        checkNewPage();
        addText('PROJECTS', 12, true, '#1e40af');
        data.projects.forEach((project) => {
            checkNewPage();
            addText(project.title, 11, true);
            if (project.description) {
                addText(project.description, 10, false, '#374151');
            }
            if (project.technologies.length > 0) {
                addText(`Technologies: ${project.technologies.join(', ')}`, 9, false, '#6b7280');
            }
            yPos += 5;
        });
    }

    // Download
    doc.save(`${data.personal.fullName || 'portfolio'}_resume.pdf`);
};

const exportToJSON = (data: PortfolioData) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personal.fullName || 'portfolio'}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const exportToHTML = (data: PortfolioData) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal.fullName || 'Portfolio'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; line-height: 1.6; color: #1f2937; background: #f3f4f6; }
        .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
        header { text-align: center; padding: 60px 20px; background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; border-radius: 12px; margin-bottom: 30px; }
        h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .title { font-size: 1.25rem; opacity: 0.9; }
        .contact { margin-top: 20px; font-size: 0.9rem; opacity: 0.8; }
        section { background: white; border-radius: 12px; padding: 30px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        h2 { color: #1e40af; font-size: 1.25rem; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
        .item { margin-bottom: 20px; }
        .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
        .item-title { font-weight: 600; color: #1f2937; }
        .item-date { font-size: 0.875rem; color: #6b7280; }
        .item-subtitle { color: #4b5563; margin-bottom: 5px; }
        .item-description { color: #6b7280; font-size: 0.9rem; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 0.875rem; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${data.personal.fullName || 'Your Name'}</h1>
            <p class="title">${data.personal.title || 'Professional Title'}</p>
            <p class="contact">
                ${[data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join(' | ')}
            </p>
        </header>

        ${data.personal.summary ? `
        <section>
            <h2>About</h2>
            <p>${data.personal.summary}</p>
        </section>
        ` : ''}

        ${data.experience.length > 0 ? `
        <section>
            <h2>Experience</h2>
            ${data.experience.map(exp => `
            <div class="item">
                <div class="item-header">
                    <span class="item-title">${exp.title}</span>
                    <span class="item-date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p class="item-subtitle">${exp.company}${exp.location ? `, ${exp.location}` : ''}</p>
                ${exp.description ? `<p class="item-description">${exp.description}</p>` : ''}
            </div>
            `).join('')}
        </section>
        ` : ''}

        ${data.education.length > 0 ? `
        <section>
            <h2>Education</h2>
            ${data.education.map(edu => `
            <div class="item">
                <div class="item-header">
                    <span class="item-title">${edu.degree}</span>
                    <span class="item-date">${edu.startYear} - ${edu.endYear}</span>
                </div>
                <p class="item-subtitle">${edu.school}</p>
                ${edu.gpa ? `<p class="item-description">GPA: ${edu.gpa}</p>` : ''}
            </div>
            `).join('')}
        </section>
        ` : ''}

        ${(data.skills.technical.length > 0 || data.skills.soft.length > 0) ? `
        <section>
            <h2>Skills</h2>
            <div class="skills">
                ${[...data.skills.technical, ...data.skills.soft, ...data.skills.languages].map(skill => `
                <span class="skill">${skill}</span>
                `).join('')}
            </div>
        </section>
        ` : ''}

        ${data.projects.length > 0 ? `
        <section>
            <h2>Projects</h2>
            ${data.projects.map(proj => `
            <div class="item">
                <p class="item-title">${proj.title}</p>
                ${proj.description ? `<p class="item-description">${proj.description}</p>` : ''}
            </div>
            `).join('')}
        </section>
        ` : ''}
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.personal.fullName || 'portfolio'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
