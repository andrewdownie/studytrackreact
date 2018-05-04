/* Imports */
import React, {Component} from 'react';

/* Component Imports */
import ProjectButtonsWrapper from './ProjectButtonsWrapper';
import ProjectList from './ProjectList';
import LoadingModal from '../modals/LoadingModal';
import EditModal from '../modals/EditModal';
import AddModal from '../modals/AddModal';
import FaSpinner from 'react-icons/lib/fa/spinner';



class ProjectSection extends Component {
    constructor(props){
        super(props);
        this.state = {
            callbacks: props.callbacks,
            noProjectsFound: this.noProjectsFound(props),
            loadedFromRemote: props.loadedFromRemote,
            showEditModal: false,
            showAddModal: false,
            showLoadingModal: false,
            loadingModalMessage: "",
            addModal_name: "",
            addModal_minGoal: 2,
            addModal_idealGoal: 5,
            editModal_originalName: props.editModal_name,
            editModal_name: props.editModal_name,
            editModal_minGoal: props.editModal_minGoal,
            editModal_idealGoal: props.editModal_idealGoal,
            projectSectionVisible: props.projectSectionVisible,
        };

    }


    noProjectsFound(props){
        var noProjectsFound;

        if(props.projectNames){
            noProjectsFound = props.projectNames.length === 0 && props.loadedFromRemote;
        }
        else{
            noProjectsFound = true;
        }

        return noProjectsFound;
    }

    componentWillReceiveProps(nextProps){

        this.setState({
            noProjectsFound: this.noProjectsFound(nextProps),
            loadedFromRemote: nextProps.loadedFromRemote,
            projectNames: nextProps.projectNames,
            showAddModal: nextProps.showAddModal,
            closeAddModal: nextProps.closeAddModal,
            showLoadingModal: nextProps.showLoadingModal,
            loadingModalMessage: nextProps.loadingModalMessage,
            editProject_name: "",
            addModal_name: "",
            addModal_minGoal: 2,
            addModal_idealGoal: 5,
            showEditModal: nextProps.showEditModal,
            editModal_name: nextProps.editModal_name,
            editModal_originalName: nextProps.editModal_name,
            editModal_minGoal: nextProps.editModal_minGoal,
            editModal_idealGoal: nextProps.editModal_idealGoal,
            projectSectionVisible: nextProps.projectSectionVisible,
        });
    }
    closeEditModal(){
        this.setState({showEditProject: false});
    }


    render(){
        if(!this.state.projectSectionVisible){
            return <span></span>;
        }

        if(this.state.loadedFromRemote === false){
            return(
                <div className="project-list">
                    <p className="text-center"><br/><FaSpinner className="spin"/> Loading project list</p>
                </div>
            );
        }

        return(
            <div className="show-grid project-section">
                <ProjectButtonsWrapper
                    callbacks={this.state.callbacks}
                    highlightAddProjectButton={this.state.noProjectsFound}
                />

                <ProjectList
                    callbacks={this.state.callbacks}
                    loadedFromRemote={this.state.loadedFromRemote}
                    noProjectsFound={this.state.noProjectsFound}
                    projectNames={this.state.projectNames}
                />

                {/* Edit Project Modal */}
                <EditModal
                    callbacks={this.state.callbacks}
                    showEditModal={this.state.showEditModal}
                    editModal_idealGoal={this.state.editModal_idealGoal}
                    editModal_minGoal={this.state.editModal_minGoal}
                    editModal_name={this.state.editModal_name}
                />
                {/* Add Project Modal */}
                <AddModal
                    callbacks={this.state.callbacks}
                    showAddModal={this.state.showAddModal}
                    addModal_idealGoal={this.state.addModal_idealGoal}
                    addModal_minGoal={this.state.addModal_minGoal}
                    addModal_name={this.state.addModal_name}
                />

                {/* Loading Modal */}
                <LoadingModal
                    showLoadingModal={this.state.showLoadingModal}
                    loadingModalMessage={this.state.loadingModalMessage}
                />


            </div>
        );
    }
}

export default ProjectSection;