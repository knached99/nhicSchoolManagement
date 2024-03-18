import React from 'react'

export default function Cards({facultyCount, studentsCount, parentsCount}) {
    console.log('Props received in Cards:', facultyCount, studentsCount, parentsCount);

  return (
    <div class="overflow-x-auto">
    <div class="flex">
    {/* Team Member Cards */}
      <div class="flex-shrink-0 bg-white rounded-lg p-6 mr-4 shadow-md">
        <h2 class="text-lg font-semibold mb-2">Team Members</h2>
        <p class="text-gray-600">Number of team members: <span class="text-blue-500 font-semibold">{facultyCount}</span></p>
      </div>
  
      {/* Students Cards */}
      <div class="flex-shrink-0 bg-white rounded-lg p-6 mr-4 shadow-md">
        <h2 class="text-lg font-semibold mb-2">Students</h2>
        <p class="text-gray-600">Number of students: <span class="text-blue-500 font-semibold">{studentsCount}</span></p>
      </div>
  
      {/* Parents  Cards */}
      <div class="flex-shrink-0 bg-white rounded-lg p-6 shadow-md">
        <h2 class="text-lg font-semibold mb-2">Parents</h2>
        <p class="text-gray-600">Number of parents: <span class="text-blue-500 font-semibold">{parentsCount}</span></p>
      </div>
    </div>
  </div>
  
  )
}
