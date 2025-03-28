import React from "@/app/assets/react.svg";
import SecondaryPanel from "@/compoments/panel/SecondaryPanel";
import Introducing from "@/compoments/Home/Introducing";
import BlogSection from "@/compoments/Home/BlogSection";
import ProjectSection from "@/compoments/Home/ProjectSection";


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
