
const Output = ({tasks,onToggle,onDelete}) => {
    if (!Array.isArray(tasks)) {
        return <p className="text-red-500">Error: Invalid tasks prop.</p>;
    }
    return (
        <div>
            <h2 className="font-semibold text-lg mb-2">Your Tasks</h2>
            {tasks.length===0? (
                <p className="text-gray-500">No tasks added yet</p>
            ):(
                <ul className="space-y-2">
                    {tasks.map((item)=>(
                        <li key={item._id} className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
                            <span
                                className="flex-1"
                                style={{
                                    textDecoration: item.completed ? "line-through" : "none",
                                    color: item.completed ? "gray" : "black",
                                }}
                            >{item.text}</span>
                            <div className="flex gap-2">
                                <button
                                    className="px-2 py-1 bg-green-200 rounded hover:bg-green-300"
                                    type="button"
                                    onClick={() => onToggle(item._id)}
                                >
                                    Done
                                </button>
                                <button
                                    className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
                                    type="button"
                                    onClick={() => onDelete(item._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Output