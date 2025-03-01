import Part from "./Part";

const Content = ({ courseParts }) => {
    // console.log("Parts: ", courseParts);
    const total = courseParts.reduce((acc, part) => acc + part.exercises, 0);
    console.log("Total: ", total);
    return (
        <div>
            {
                courseParts.map(part =>
                    <Part key={part.id} name={part.name} exercises={part.exercises} />
                )
            }
            <p><strong>total of {total} exercises</strong></p>
        </div>
    );
}

export default Content;