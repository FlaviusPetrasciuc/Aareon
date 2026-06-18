'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/globals/Navbar';
import Stepper from '../../components/globals/Stepper';
import PageHeader from '@/components/globals/PageHeader';


const STEPS = ['Basis', 'Functieomschrijving', 'Overzicht', 'Doorsturen naar recruiter'];
const CURRENT_STEP = 3;

const locationDescriptions: Record<string, string> = {
  "emmen": "Aareon is Europa's toonaangevende softwarepartner voor vastgoed- en organisatiebeheer. Vanuit meerdere vestigingen in Nederland werken we dagelijks aan slimme SaaS-oplossingen die organisaties in de woningcorporatie-, zorg-, onderwijs- en overheidsector écht verder helpen. Bij Aareon doe je werk dat er toe doet voor meer dan 13.000 klanten die op onze software vertrouwen. Je werkt in een omgeving waar innovatie geen buzzword is, maar een dagelijkse werkelijkheid, en waar jouw bijdrage zichtbaar impact heeft.",
  "amsterdam": "Aareon is Europa's toonaangevende softwarepartner voor vastgoed- en organisatiebeheer. Vanuit meerdere vestigingen in Nederland werken we dagelijks aan slimme SaaS-oplossingen die organisaties in de woningcorporatie-, zorg-, onderwijs- en overheidsector écht verder helpen. Bij Aareon doe je werk dat er toe doet voor meer dan 13.000 klanten die op onze software vertrouwen. Je werkt in een omgeving waar innovatie geen buzzword is, maar een dagelijkse werkelijkheid, en waar jouw bijdrage zichtbaar impact heeft.",
  "groningen-embrace": "Bij Embrace helpen we organisaties hun digitale dienstverlening en samenwerking slimmer en mensgerichter te maken. Met onze software brengen we communicatie, processen en klantcontact samen in één platform. Denk aan een social intranet, klantportalen en een omnichannel CRM waarmee organisaties hun klanten én medewerkers beter ondersteunen. Bij Embrace geloven we in vrijheid, verantwoordelijkheid en samenwerken.",
  "groningen-blueMountain": "Blue Mountain bestaat uit een diversiteit aan professionals met ieder eigen talenten en allen een grote liefde voor data. Wij zijn gespecialiseerd in het werkend krijgen van business intelligence binnen organisaties. We geven betekenis aan data en maken het mogelijk dat mensen én organisaties in beweging komen. Bij Blue Mountain werken we vanuit vertrouwen en verbeteren we vanuit bevlogenheid.",
  "sneek-embrace": "Bij Embrace helpen we organisaties hun digitale dienstverlening en samenwerking slimmer en mensgerichter te maken. Met onze software brengen we communicatie, processen en klantcontact samen in één platform. Denk aan een social intranet, klantportalen en een omnichannel CRM waarmee organisaties hun klanten én medewerkers beter ondersteunen. Bij Embrace geloven we in vrijheid, verantwoordelijkheid en samenwerken.",
  "sneek-viadata": "Wij zijn dé specialist in slimme softwareoplossingen voor serviceorganisaties, met een sterke focus op de corporatiesector. Onze producten zijn gebaseerd op Microsoft Dynamics 365 en helpen organisaties om hun serviceprocessen slimmer, sneller en klantgerichter te maken. We zijn een groeiende, innovatieve club met een nuchtere mentaliteit die gelooft in vrijheid, vertrouwen en verantwoordelijkheid.",
  "enschede-facilitor": "Bij Facilitor werk je in een open en informele sfeer met collega's die elkaar helpen. We leveren al jaren hoge klanttevredenheid en daar zijn we trots op. Je komt terecht in een hecht team waar samenwerken en leren vanzelfsprekend is. Daarnaast zijn we een business unit van Aareon, het grootste vastgoedsoftwarebedrijf van Europa.",
  "breda-blue-mountain": "Blue Mountain bestaat uit een diversiteit aan professionals met ieder eigen talenten en allen een grote liefde voor data. Wij zijn gespecialiseerd in het werkend krijgen van business intelligence binnen organisaties. We geven betekenis aan data en maken het mogelijk dat mensen én organisaties in beweging komen. Bij Blue Mountain werken we vanuit vertrouwen en verbeteren we vanuit bevlogenheid.",
  "oosterhout-twinq": "TwinQ is specialist in VvE-beheersoftware en onderdeel van de Aareon Group. We helpen VvE-beheerders om financiële, technische en administratieve processen te automatiseren, zoals het verwerken van facturen en het bijhouden van de financiën. Ook bieden we een VvE Portaal waar VvE-leden documenten, notulen en financiële informatie kunnen inzien.",
  "roermond": "Aareon is Europa's toonaangevende softwarepartner voor vastgoed- en organisatiebeheer. Vanuit meerdere vestigingen in Nederland werken we dagelijks aan slimme SaaS-oplossingen die organisaties in de woningcorporatie-, zorg-, onderwijs- en overheidsector écht verder helpen. Bij Aareon doe je werk dat er toe doet voor meer dan 13.000 klanten die op onze software vertrouwen. Je werkt in een omgeving waar innovatie geen buzzword is, maar een dagelijkse werkelijkheid, en waar jouw bijdrage zichtbaar impact heeft."
};

interface BasicsData {
  jobTitle?: string;
  department?: string;
  location?: string;
  workMode?: string;
  employmentType?: string;
  salaryMin?: string;
  salaryMax?: string;
  currency?: string;
  education?: string;
  companyCar?: boolean;
  companyPhone?: boolean;
  mustHaves?: string;
  niceToHaves?: string;
  shouldntHaves?: string;
  additionalDetails?: string;
}

const S = {
  reviewText: 'Controleer de details van uw vacature voordat u verdergaat.',
  location: 'Locatie',
  department: 'Afdeling',
  workMode: 'Werkwijze',
  employmentType: 'Dienstverband',
  salaryRange: 'Salarisbereik',
  education: 'Opleiding',
  equipment: 'Werkuitrusting',
  aboutRole: 'Over de functie',
  responsibilities: 'Verantwoordelijkheden',
  requirements: 'Vereisten',
  mustHaves: 'Vereist',
  niceToHaves: 'Pré',
  shouldntHaves: 'Niet wenselijk',
  whatWeOffer: 'Wat wij bieden',
  aboutCompany: 'Over de vestiging',
  back: '← Terug',
  next: 'Volgende →',
};

interface JobDescriptionData {
  summary?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
}

export default function Overview() {
  const router = useRouter();
  const [basics, setBasics] = useState<BasicsData>({});
  const [jd, setJd] = useState<JobDescriptionData>({});

  useEffect(() => {
    try {
      const b = localStorage.getItem('jobPostingFormData');
      if (b) setBasics(JSON.parse(b));
    } catch (error) {
      console.log(error);
    }

    try {
      const j = localStorage.getItem('jobDescriptionFormData');
      if (j) setJd(JSON.parse(j));
    } catch (error) {
      console.log(error)
    }
  }, []);

  const handleNext = () => router.push('/forward-to-recruiter');
  const handleBack = () => router.push('/job-description');

  const salary =
    basics.salaryMin && basics.salaryMax
      ? `${basics.currency ?? '€'}${basics.salaryMin} - ${basics.currency ?? '€'}${basics.salaryMax} per month`
      : '—';

  const equipment = [
    basics.companyCar && 'Leaseauto',
    basics.companyPhone && 'Zakelijke telefoon',
  ].filter(Boolean).join(', ') || '—';


  const normalizedLocation = basics.location?.trim().toLowerCase() ?? '';
  const companyDescription =
    locationDescriptions[normalizedLocation] ||
    'No company description is available for this location yet.';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f7f6f3] text-[#1f2937]">
        <div className="mx-auto max-w-7xl px-8 py-8">
          {/* Header */}
          <PageHeader
            stepLabel="Overzicht"
            currentStep={CURRENT_STEP}
            totalSteps={STEPS.length}
            title="Nieuwe vacature aanmaken"
            subtitle="Vier stappen — ongeveer 5 minuten"
          />

          {/* Stepper */}
          <Stepper
            steps={STEPS}
            currentStep={CURRENT_STEP}
          />

          {/* Content */}
          <div className="space-y-8 p-8">
            <div>
              <h2 className="text-2xl font-serif text-[#172033] mb-2">
                {basics.jobTitle || 'Untitled Position'}
              </h2>
              <p className="text-gray-500 text-sm">
                Review the details of your job posting before moving on.
              </p>
            </div>

            {/* Job Details Grid */}
            <div className="grid grid-cols-2 gap-6 pb-4 border-b border-[#e7e5e4]">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.location}</h3>
                <p className="text-[#172033] capitalize">{basics.location || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.department}</h3>
                <p className="text-[#172033] capitalize">{basics.department || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.workMode}</h3>
                <p className="text-[#172033] capitalize">{basics.workMode || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.employmentType}</h3>
                <p className="text-[#172033] capitalize">{basics.employmentType || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.salaryRange}</h3>
                <p className="text-[#172033]">{salary}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.education}</h3>
                <p className="text-[#172033] uppercase">{basics.education || '—'}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{S.whatWeOffer}</h3>
                <p className="text-[#172033]">{equipment}</p>
              </div>
            </div>

            {jd.summary && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">{S.aboutRole}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{jd.summary}</p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-[#172033] mb-3">{S.aboutCompany}</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {companyDescription}
              </p>
            </div>

            {jd.responsibilities && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">{S.responsibilities}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{jd.responsibilities}</p>
              </div>
            )}

            {jd.requirements && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">{S.requirements}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{jd.requirements}</p>
              </div>
            )}

            {jd.benefits && (
              <div>
                <h3 className="text-lg font-semibold text-[#172033] mb-3">{S.whatWeOffer}</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{jd.benefits}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end border-t border-[#e7e5e4] bg-[#f7f6f3] px-8 py-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="rounded-xl border border-[#d6d3d1] bg-white px-5 py-3 font-medium text-[#172033] transition hover:bg-gray-50"
              >
                {S.back}
              </button>
              <button
                onClick={handleNext}
                className="rounded-xl bg-[#6b6fcf] px-5 py-3 font-medium text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--color-blue)' }}
              >
                {S.next}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}