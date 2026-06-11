import React from 'react';
import { Users, UserPlus } from 'lucide-react';

const RecruitmentTeam = () => {
  return (
    <div className="form-card flex-1">
      <div className="form-header">
        <h2 className="form-title">
          <Users size={20} className="text-[var(--color-warning)]" />
          Equipo de Reclutamiento
        </h2>
        <a href="#" className="text-[var(--color-primary)] text-sm font-semibold hover:underline">Manage Team</a>
      </div>

      <div className="team-list">
        <div className="team-member">
          <div className="team-avatar">
            <img src="https://i.pravatar.cc/150?img=5" alt="Andrea Mendoza" />
            <div className="status-dot"></div>
          </div>
          <div className="member-info">
            <h4>Andrea Mendoza</h4>
            <p>Senior Recruiter</p>
          </div>
        </div>

        <div className="team-member">
          <div className="team-avatar">
            <img src="https://i.pravatar.cc/150?img=11" alt="Roberto Jiménez" />
            <div className="status-dot"></div>
          </div>
          <div className="member-info">
            <h4>Roberto Jiménez</h4>
            <p>Technical Sourcer</p>
          </div>
        </div>
      </div>

      <button className="btn-dashed">
        <UserPlus size={18} /> Invite New Member
      </button>
    </div>
  );
};

export default RecruitmentTeam;
