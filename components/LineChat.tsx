"use client";

interface Message {
  id: string;
  sender: string;
  text: string;
  type: "left" | "right";
}

export default function LineChat({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-3 p-4">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.type === "right" ? "justify-end" : "justify-start"}`}>
          {msg.type === "left" && (
            <div className="flex items-end gap-2 max-w-[80%]">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs text-gray-500 font-medium">
                {msg.sender.charAt(0)}
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-0.5">{msg.sender}</div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800">
                  {msg.text}
                </div>
              </div>
            </div>
          )}
          {msg.type === "right" && (
            <div className="max-w-[80%]">
              <div className="bg-yellow-300 rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-gray-800">
                {msg.text}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
