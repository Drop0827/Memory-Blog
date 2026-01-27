export interface InfoOne {
    name: string;
    avatar: StaticImageData;
    profession: string;
    introduction: string;
}

export interface InfoTwo {
    author: string;
    avatar_url: string;
    left_tags: string[];
    right_tags: string[];
    know_me: string;
};

export interface Character {
    value: number;
    text1: string;
    text2: string;
    content: string;
    color: string;
}

export interface Goal {
    status: number;
    value: string;
}

export interface Project {
    name: string;
    images: string[];
    description: string;
    front: {
        name: string;
        technology: string;
        url: string;
    };
    control: {
        name: string;
        technology: string;
        url: string;
    };
    backend: {
        name: string;
        technology: string;
        url: string;
    };
}

export interface MyData {
    info_style: 'info_one' | 'info_two',
    info_one: InfoOne,
    info_two: InfoTwo,
    character: Character[],
    goals: Goal[],
    project: Project[]
    technology_stack: string[],
    hometown: number[]
}