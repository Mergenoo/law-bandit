import Link from "next/link";

export default function ProjectsPage() {
  const mockProjects = [
    {
      id: "1",
      title: "Contract Dispute Case",
      description: "Breach of contract case for TechCorp Inc.",
      status: "active",
      client: "TechCorp Inc.",
      lastUpdated: "2024-01-15",
    },
    {
      id: "2",
      title: "Personal Injury Claim",
      description: "Car accident injury claim for John Smith",
      status: "pending",
      client: "John Smith",
      lastUpdated: "2024-01-10",
    },
    {
      id: "3",
      title: "Real Estate Transaction",
      description: "Commercial property purchase for ABC Corp",
      status: "completed",
      client: "ABC Corp",
      lastUpdated: "2024-01-05",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              New Project
            </button>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {mockProjects.map((project) => (
                <li key={project.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold">
                              {project.title.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {project.title}
                            </p>
                            <span
                              className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                project.status
                              )}`}
                            >
                              {project.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">
                            {project.description}
                          </p>
                          <p className="text-sm text-gray-400">
                            Client: {project.client}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          Updated: {project.lastUpdated}
                        </span>
                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
