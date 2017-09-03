import {Component, Input} from "@angular/core";
import {TopicPartition} from "../domain/TopicPartition";
import {ApiService} from "../services/api.service";
import {Consumer} from "../domain/Consumer";

@Component({
    selector: "topic-consumers",
    template: `
        <div class="card">
            <div *ngIf="selectedTopicPartition" class="card-header card-header-title">Showing consumers for <span
                    class="text-primary">{{selectedTopicPartition.topic.name}}</span>
            </div>

            <div *ngIf="!selectedTopicPartition" class="card-header card-header-title">No Topic Selected</div>

            <ul *ngIf="consumers.length > 0" class="list-group list-group-flush">
                <collapsible-item *ngFor="let consumer of consumers">
                    <div item-header>
                        <div><span class="text-danger">Consumer ID: </span> {{consumer.consumerId}}</div>
                        <div><span class="text-danger">Group ID: </span> {{consumer.groupId}}</div>
                    </div>
                    <div item-body>
                        <div class="text-danger">Assignments:</div>
                        <div style="padding-left: 20px; padding-bottom: 10px;"
                             *ngFor="let assignment of consumer.assignments">
                            <div><span class="text-success">Topic: </span> {{assignment.topic}}</div>
                            <div><span class="text-success">Partition: </span> {{assignment.partition}}</div>
                        </div>
                    </div>
                </collapsible-item>
            </ul>

            <div *ngIf="selectedTopicPartition && consumers.length == 0 && !isLoading" class="card-body">
                <div>No consumers found</div>
            </div>

            <div *ngIf="isLoading" class="card-body">
                <div>Loading...</div>
            </div>
        </div>
    `
})
export class TopicConsumersComponent {
    public consumers: Array<Consumer> = [];
    public isLoading: boolean;
    private _selectedTopicPartition: TopicPartition;

    public constructor(private apiService: ApiService) {
    }

    @Input()
    public set selectedTopicPartition(topicPartition: TopicPartition) {
        this._selectedTopicPartition = topicPartition;
        this.consumers.length = 0;
        this.isLoading = true;

        this.apiService.getTopicConsumers(this._selectedTopicPartition.topic, this._selectedTopicPartition.partition).subscribe(consumers => {
            consumers.forEach(consumer => this.consumers.push(consumer));

            this.isLoading = false;
        });
    }

    public get selectedTopicPartition() {
        return this._selectedTopicPartition;
    }
}
