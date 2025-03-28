import React from "@/app/assets/react.svg";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Introducing from "@/compoments/Home/Introducing";
import dynamic from 'next/dynamic';

const ProjectSection = dynamic(() => import("../compoments/Home/ProjectSection"), {
    loading: () => <div>Loading projects...</div>,
});

const BlogSection = dynamic(() => import("../compoments/Home/BlogSection"), {
    loading: () => <div>Loading blog posts...</div>,
});

export default async function Home() {
    return (
        <>
            <SecondaryPanel className="min-h-[75vh] lg:min-h-[50vh] h-auto p-4">
                <Introducing />
            </SecondaryPanel>

            <BlogSection />
            <ProjectSection />
        </>
    );
}
