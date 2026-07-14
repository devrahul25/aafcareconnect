import fs from 'fs';

let content = fs.readFileSync('src/components/admin/UserDrawerEnhanced.jsx', 'utf-8');

// Replace imports
content = content.replace(
  'import { getUserCertificates, getUserAuditLog, getComplianceExplainer, getProfessionalLevel, fmt, daysUntil } from "@/lib/platformStore";',
  'import { getProfessionalLevel, fmt, daysUntil } from "@/lib/platformStore";\nimport { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";\nimport { apiClient } from "@/api/apiClient";\nimport toast from "react-hot-toast";'
);

// We need to inject useQuery hooks inside UserDrawerEnhanced
// Right after: export default function UserDrawerEnhanced({ user, onClose }) {
//   const [innerTab, setInnerTab] = useState("overview");
//   if (!user) return null;

const hooks = `
  const queryClient = useQueryClient();
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const { data: certs = [] } = useQuery({
    queryKey: ['compliance-records', user.id],
    queryFn: () => apiClient.get(\`/compliance-records?userId=\${user.id}\`).then(res => res.data.data || [])
  });

  const { data: enrolments = [], refetch: refetchEnrolments } = useQuery({
    queryKey: ['course-enrolments', user.id],
    queryFn: () => apiClient.get(\`/course-enrolments?userId=\${user.id}\`).then(res => res.data.data || [])
  });

  const { data: allCourses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => apiClient.get('/courses').then(res => res.data.data || [])
  });

  const assignCourseMutation = useMutation({
    mutationFn: (courseId) => apiClient.post('/course-enrolments', { user_id: user.id, course_id: courseId }),
    onSuccess: () => {
      toast.success("Course assigned successfully");
      setIsAssigning(false);
      refetchEnrolments();
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to assign course");
    }
  });

  const handleAssignCourse = () => {
    if (!selectedCourseId) return;
    assignCourseMutation.mutate(selectedCourseId);
  };
`;

content = content.replace(
  '  if (!user) return null;\n\n  const certs = getUserCertificates(user.id);\n  const auditEntries = getUserAuditLog(user.id);\n  const complianceReasons = getComplianceExplainer(user);\n  const level = getProfessionalLevel(user);\n  const risk = RISK_CFG[user.riskLevel] || RISK_CFG.low;',
  `  if (!user) return null;
${hooks}
  // Mock audit entries for now as backend endpoint is missing
  const auditEntries = []; 
  const complianceReasons = certs.filter(c => c.status === 'expired').map(c => \`\${c.title} has expired.\`);
  if (complianceReasons.length === 0) complianceReasons.push("All mandatory training is up to date.");
  const level = getProfessionalLevel(user);
  const risk = RISK_CFG[user.riskLevel] || RISK_CFG.low;`
);

// We need to add a new Tab for Assigned Courses, or add it inside "overview"
// Let's add it to the innerTabs
content = content.replace(
  '[["overview","Overview"],["certs","Certificates"],["compliance","Compliance"],["activity","Activity"]]',
  '[["overview","Overview"],["courses","Courses"],["certs","Certificates"],["compliance","Compliance"],["activity","Activity"]]'
);

// Add the rendering for the "courses" tab
const coursesTab = `
          {innerTab === "courses" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-blue-600 font-bold">⚡ Assigned Training</span>
                <button 
                  onClick={() => setIsAssigning(!isAssigning)}
                  className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {isAssigning ? 'Cancel' : '+ Assign New'}
                </button>
              </div>

              {isAssigning && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-slate-700 mb-2">Select a course to assign:</p>
                  <select 
                    className="w-full text-sm border-slate-200 rounded-lg mb-3 p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedCourseId}
                    onChange={e => setSelectedCourseId(e.target.value)}
                  >
                    <option value="">-- Choose Course --</option>
                    {allCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleAssignCourse}
                    disabled={!selectedCourseId || assignCourseMutation.isPending}
                    className="w-full h-8 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {assignCourseMutation.isPending ? 'Assigning...' : 'Assign Course'}
                  </button>
                </div>
              )}

              {enrolments.length === 0 && !isAssigning && <p className="text-xs text-slate-400 text-center py-4">No courses assigned</p>}
              
              <div className="space-y-2">
                {enrolments.map(enrolment => (
                  <div key={enrolment.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                      {enrolment.course?.thumbnail_url ? (
                        <img src={enrolment.course.thumbnail_url} className="w-full h-full object-cover" />
                      ) : (
                        <BookOpen className="w-5 h-5 m-2.5 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{enrolment.course?.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={\`text-[10px] px-2 py-0.5 rounded-full font-semibold \${
                          enrolment.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                          enrolment.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        }\`}>
                          {enrolment.status}
                        </span>
                        {enrolment.status === 'IN_PROGRESS' && (
                          <span className="text-[10px] text-slate-500">{enrolment.progress_percent}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
`;

content = content.replace('{innerTab === "certs" && (', coursesTab + '\n          {innerTab === "certs" && (');

// Also wire up the "Assign Course" button in the footer to open the courses tab and start assigning
content = content.replace(
  '<button className="h-8 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 flex items-center justify-center gap-1 transition-colors">',
  '<button onClick={() => { setInnerTab("courses"); setIsAssigning(true); }} className="h-8 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 flex items-center justify-center gap-1 transition-colors">'
);

fs.writeFileSync('src/components/admin/UserDrawerEnhanced.jsx', content);
