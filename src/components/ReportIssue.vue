<template>

    <div id="report-issue" class="mt-5 text-center">
        <v-btn size="x-small" variant="text" @click="openReportIssueModal">
        Report Issue
        </v-btn>
    </div>

    <v-dialog
        v-model="reportIssueModalVisible"
        width="300"
        max-width="400"
    >
        <v-card title="Report Issue">
            <template v-slot:text>
                
                <v-textarea
                    label="Describe your issue"
                    v-model="issueDescription"
                    rows="2"
                ></v-textarea>

                <v-btn color="primary" block @click="submitIssue" rounded="0">Submit</v-btn>
            </template>
        </v-card>
    </v-dialog>

</template>

<script setup>
import { ref, defineProps } from 'vue';
import axios from 'axios';
import Toast, { createToast } from 'mosha-vue-toastify'

const props = defineProps({
    open: {
        type: Boolean,
        default: false
    },
    food_slug: {
        type: String,
        default: ''
    }
});

const API_BASE_URI = import.meta.env.VITE_API_URI;

const issueDescription = ref('');

const reportIssueModalVisible = ref(false);

const submitIssue = async () => {
   
    if (issueDescription.value.trim()) {

        try {
            await axios.post(`${API_BASE_URI}/report-issue`, 
                { 
                    'page': `/food/${props.food_slug}`,
                    'description': issueDescription.value
                }, 
            );

            createToast(
                {
                    title: 'Submitted!',
                    description: "Your issue was submitted. Thank you for your contribution. We really appreciate it!"
                }, 
                { type: 'success', position: 'bottom-right' }
            );

            issueDescription.value = '';
            reportIssueModalVisible.value = false;
            
        } catch (err) {
            console.log('submit issue error: ', err);
        }
    }
    
}


const openReportIssueModal = () => {
    reportIssueModalVisible.value = true;
}
</script>