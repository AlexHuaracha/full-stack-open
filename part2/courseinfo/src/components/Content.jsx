import Part from "./Part";

const Content = ({ courseParts }) => {
    // console.log("Parts: ", courseParts);
    return (
        <div>
            {
                courseParts.map(part =>
                    <Part key={part.id} name={part.name} exercises={part.exercises} />
                )
            }
        </div>
    );
}

export default Content;